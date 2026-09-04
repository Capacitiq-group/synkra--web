> **SUPERSEDED.** The admin panel described here as "doesn't exist as code yet"
> is `synkra-os`, and this repo's collections were consolidated onto the shared
> instance that `synkra-os` hosts — so the two-instance picture below is out of
> date. Current architecture: [`SYNKRA-ARCHITECTURE.md` in `synkra-os`](https://github.com/Capacitiq-group/synkra-os/blob/main/SYNKRA-ARCHITECTURE.md).

# Admin Panel ⇄ Website Communication Architecture

**Status:** Design doc — the admin panel doesn't exist as code yet. This
is what to build it against, not a description of something already
running. Same spirit as `nango-integration-architecture.md` — read this
before wiring the admin panel to either PocketBase instance.

---

## 1. The core pattern: no sync layer, no data duplication

Website (`synkra--web-main`) and Client Hub (`synkra-client-hub`) each run
their **own separate PocketBase instance**. The admin panel is a third
system that needs visibility into both. There are two ways to do that:

- **(a) Sync/replicate data** into a third database the admin panel owns.
- **(b) The admin panel reads and writes directly against both existing
  instances**, live, no copy of the data anywhere else.

**Use (b).** PocketBase already gives you everything a sync layer would
have to reinvent: a REST API, realtime subscriptions (Server-Sent Events)
for live updates, and per-collection access rules. A sync layer adds a
second source of truth that can drift, a schedule/webhook system to keep
it current, and reconciliation logic for conflicts — none of which
actually buys anything here, since nothing about this data needs to be
transformed or aggregated across instances, it just needs to be *visible*
in one place.

The one exception is §5 below (a single, deliberate one-way copy for
Waitlist → Client Hub, when Chat launches) — everything else is live
reads/writes, not sync.

---

## 2. Who talks to whom

```
                    ┌─────────────────────────┐
                    │      Admin Panel          │
                    │   (its own backend)        │
                    └──────────┬────────────────┘
                               │
              ┌────────────────┼────────────────┐
              │                                  │
              ▼                                  ▼
   ┌─────────────────────┐          ┌──────────────────────┐
   │  Website PocketBase   │          │  Client Hub PocketBase │
   │  (os.synkra.co.za)      │          │  (pb.synkra.co.za)     │
   └─────────────────────┘          └──────────────────────┘
```

**The admin panel's own backend holds the credentials, never its
frontend.** Same principle already established for `client.server.ts` in
this codebase (superuser client, server-side only). The admin panel needs
its **own superuser (or scoped) account on each instance** — do not reuse
`POCKETBASE_ADMIN_EMAIL`/`POCKETBASE_ADMIN_PASSWORD` from either existing
`.env`. Two separate credential pairs:

```
# On the admin panel's backend only
WEBSITE_PB_URL=https://os.synkra.co.za
WEBSITE_PB_ADMIN_EMAIL=admin-panel@synkra.co.za
WEBSITE_PB_ADMIN_PASSWORD=...

CLIENT_HUB_PB_URL=https://pb.synkra.co.za
CLIENT_HUB_PB_ADMIN_EMAIL=admin-panel@synkra.co.za
CLIENT_HUB_PB_ADMIN_PASSWORD=...
```

Recommend provisioning these as **dedicated accounts, not the same
superuser used for deploy/migration tooling** — if the admin panel is ever
compromised, you want to be able to revoke its access without also
breaking deploys.

**For live updates** (e.g. a new 🟢 High Priority Integration Partner
application should show up without a page refresh), the admin panel's
frontend can subscribe directly to PocketBase's realtime feed on the
relevant collection — this works cross-origin, authenticated with a
short-lived token its backend issues, same as the website's own admin
dashboard already does against its instance.

---

## 3. What the admin panel needs from Website's PocketBase

| Collection | Why the admin panel needs it |
|---|---|
| `clients` | Every Agency client: company, contact, service, plan tier, status, credit balance. This is the Agency side of "the clients, literally everything." |
| `credit_transactions` | Usage/billing history per Agency client. |
| `form_submissions` | Every lead from every site form — general contact, `talk_to_us` (see §4), partner applications. `status` field already exists for admin triage. |
| `integration_partner_applications` | Full application + `ai_score`/`ai_flag`/`ai_summary`/`ai_strengths`/`ai_risks`/`ai_missing_information` + admin `status`. This is the whole point of the AI scoring — useless if the admin panel can't see it. |
| `approved_partners` | Active Agency/Referral partners, commission rates, status. |
| `waitlist` | Flow/Chat waitlist signups — who's waiting, for what. |
| `admin_audit_log` | Every admin action taken on the website's own dashboard — gives the admin panel a full activity trail, not just a snapshot. |
| `services`, `blog_posts`, `portfolio_items` | Lower priority for an "at a glance" ops view, but the admin panel is the natural place to eventually manage this content too, rather than maintaining two separate admin UIs. |

---

## 4. What the admin panel needs from Client Hub's PocketBase

This is the Flow/Chat subscription side — "the subscriptions, the
clients" from your message. Per `POCKETBASE_COLLECTIONS.md` in that repo:

| Collection | Why the admin panel needs it |
|---|---|
| `users` | Every Flow/Chat account: `tier` (free/basic/pro), business profile, signup date. This is literally the subscriber list. |
| Usage/execution records (per that repo's schema — workflow runs, credit consumption) | So the admin panel can show real usage, not just "they're on Pro," e.g. for support conversations or spotting accounts about to hit limits. |
| Billing/payment records (Paystack-driven, per `billing/config.ts`) | Subscription status, payment history — needed for the same "at a glance" financial picture Agency clients already get via `credit_transactions`. |

I'm listing these by category rather than exact field names since I
don't have full visibility into every collection in that repo the way I
do for the one I've been editing directly — confirm exact schema against
`POCKETBASE_COLLECTIONS.md` when the admin panel's data layer gets built.

---

## 5. The one deliberate exception: Waitlist → Client Hub

Per the earlier PocketBase migration plan: when Chat actually launches,
`waitlist` entries (`product: "chat"`) need to become real invitations in
Client Hub so those people can be onboarded first. This is **not a live
sync** — it's a one-off export/import triggered manually when that day
comes, exactly as already documented in
`POCKETBASE-MIGRATION-PLAN.md`. Nothing to build now.

---

## 6. What flows the other way (admin panel → website)

Not everything is read-only. The admin panel needs to **write back**:
- `form_submissions.status` (new → read → archived → converted)
- `integration_partner_applications.status` (new → reviewing → contacted
  → approved → declined) — note the AI never touches this field, only
  `ai_flag`. The admin panel is where a human actually changes `status`.
- `approved_partners` — creating a new approved partner record, updating
  commission rates or status.
- `clients` — status changes, credit grants (already exposed via
  `admin.functions.ts`'s `setClientStatus`/`addClientCredits` — the admin
  panel would call the equivalent against the same collection, either by
  reusing those server functions directly if the admin panel and website
  ever share a deployment, or reimplementing the same two calls against
  its own PocketBase client if it's fully separate).

---

## 7. Summary: build order when the admin panel is ready

1. Admin panel backend gets its own PocketBase superuser account on both
   instances (§2).
2. Read-only dashboard views first: Agency clients, Flow/Chat
   subscribers, leads, Integration Partner applications with AI flags
   (§3, §4) — this alone delivers the "at a glance" view.
3. Realtime subscriptions for the things that benefit from not waiting
   for a refresh — new leads, new high-priority partner applications.
4. Write-back actions (§6) — status changes, credit grants, partner
   approval.
5. Waitlist → Client Hub export (§5) — only when Chat actually launches.
