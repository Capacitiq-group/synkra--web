# web-main: Supabase → PocketBase Migration Plan

Scope: `synkra--web-main` only (marketing site + admin CMS). This is a new,
dedicated PocketBase instance, separate from the one already serving
`synkra-client-hub`. Two decisions below are still open and block the auth
layer — the collection schema itself doesn't depend on either, so it's
ready now.

---

## RESOLVED

**1. MFA — PocketBase native email-OTP** (not TOTP). Second factor arrives
by email as a one-time code, not via an authenticator app. `admin.mfa.tsx`
gets rebuilt around PocketBase's built-in OTP request/verify calls instead
of Supabase's `auth.mfa` API — no `totp_secret` field, no `otplib`
dependency, no QR-code enrollment screen needed.

**2. Cross-instance "communication" — resolved, and it's simpler than
expected.** Checked client-hub's actual code: it already has a complete,
working, no-account-needed checkout at `/checkout?plan=free|basic|pro`
(`src/routes/checkout.tsx`), which picks a plan, charges via Paystack, and
creates the `users` record directly in client-hub's own PocketBase. web-main
never needs to hold subscription data at all.

- **Flow Subscribe CTAs** → link straight to
  `https://flow.synkra.co.za/checkout?plan={tier}`. No new code on
  web-main beyond the link itself.
- **Chat Subscribe CTAs** → no checkout tier exists for Chat yet
  (`PURCHASABLE_TIERS` in client-hub is `["basic", "pro"]`, both Flow-only
  today). Route these to web-main's own `waitlist` collection instead
  (`product: "chat"`) until a Chat tier is added to client-hub's plan
  config — at that point this becomes the same pattern as Flow.
- This also resolves the pricing conflict flagged earlier in this project:
  client-hub's billing config hardcodes `CURRENCY = "ZAR"` and
  `PROVIDER = "paystack"` — the $199/$399 USD figures from the operating-
  logic doc never made it into the real checkout and should be treated as
  stale.
- No PocketBase-to-PocketBase sync job needed for subscriptions. The one
  remaining candidate for a future one-off sync is inviting `waitlist`
  signups once Chat actually launches — a deliberate export/import at that
  time, not a live integration to build now.

---

## IMPLEMENTED — code delivered

All auth, data-access, and upload code has been written against the plan
below (no UI changes, per instruction — the login/MFA screens changed
minimally and only because email-OTP has no enroll/QR step to render).

**New files** (map to these paths in the repo root):
- `src/integrations/pocketbase/client.ts` — browser client
- `src/integrations/pocketbase/client.server.ts` — superuser client (`getPbAdmin()`)
- `src/integrations/pocketbase/auth-middleware.ts` — `requireAdminAuth`, replaces `requireSupabaseAuth`
- `src/lib/admin.functions.ts` — full rewrite, all 15 functions
- `src/lib/public.functions.ts` — full rewrite
- `src/routes/admin.login.tsx` — password step, catches `mfaId`
- `src/routes/admin.mfa.tsx` — email-OTP verify (no enroll/QR — OTP needs no setup)
- `src/routes/_admin.tsx` — guard, checks `pb.authStore.isValid` only
- `src/routes/api/admin.upload.ts` — same `{bucket, filename, contentType, base64} -> {path, url}` contract, now backed by a `media` collection
- `src/routes/api/submit-form.ts` — full rewrite

**Modified, minimal diff:**
- `src/components/admin/ImageUpload.tsx` — two lines only (token source: `pb.authStore.token` instead of a Supabase session lookup). No JSX/UI touched.

**Now dead, safe to delete once the above is merged and verified:**
- `src/integrations/supabase/` (entire folder — client.ts, client.server.ts, auth-middleware.ts, types.ts)
- `supabase/migrations/` (entire folder)
- `@supabase/supabase-js` from `package.json`

**New collection needed beyond the original mapping — `media`:**
Backs the upload endpoint. Fields: `bucket` (select: `portfolio-images` |
`blog-images`), `filename` (text), `file` (file field, single). Rules:
List/View — `""` (public, since these images render on public portfolio/
blog pages). Create/Update/Delete — leave unset (superuser-only via API);
the upload endpoint always writes through `getPbAdmin()`, never a regular
admin session.

**`admin_users` MFA setting:** enable MFA on this collection from the
PocketBase dashboard, with OTP as one of the two required auth methods
(alongside password). This is a dashboard/instance-config step, not
something expressible in application code — do this when provisioning the
new instance, before the first admin logs in.

---

## Collection mapping

PocketBase's access-rule model is per-collection (List/View/Create/Update/
Delete rules as filter expressions), not Postgres RLS — so `has_role(uid,
'admin')` becomes a rule that checks the requesting user's own admin
collection membership. Two realistic ways to model "admin": (a) a separate
`admin_users` auth collection distinct from any regular-user collection —
recommended, since this site currently has no regular end-user accounts at
all, only admins — or (b) a `role` field on a single auth collection.
Going with (a) below since it matches the existing shape 1:1 and this app
has no other user type.

### `admin_users` (auth collection)
Replaces Supabase `auth.users` + `admin_users` + `user_roles` combined —
PocketBase auth collections already carry `id`, `email`, `password`,
`verified`, `created`, `updated` natively, so `user_roles`/`has_role()`
disappears entirely (every record in this collection *is* an admin).

| Field | Type | Notes |
|---|---|---|
| `full_name` | text | |
| `avatar_url` | text | or a PocketBase `file` field instead, see Storage below |
| `last_sign_in_at` | date | |
| `totp_secret` | text, hidden from API | only if hand-rolling TOTP (Open Q1) |

Rules: List/View — `@request.auth.id = id`. Update — `@request.auth.id =
id`. Create/Delete — superuser only (provision admins manually, matches
current reality — there's no public admin signup today).

### `services` (base collection)
Direct field-for-field port: `slug` (unique), `name`, `description`,
`setup_fee` (number), `monthly_basic`/`monthly_standard`/`monthly_premium`
(number), `usage_rate` (number), `usage_unit` (text), `sort_order`
(number), `active` (bool).

Rules: List/View — `active = true || @request.auth.id != ""` (any logged-in
admin bypasses the active filter, matching the old `OR has_role admin`).
Create/Update/Delete — `@request.auth.id != ""`.

Note: current seed data still has the eight *old* services (`ai-voice-
agents`, `ai-chatbots`, `ai-content-creation`, etc.) — none of these match
the four confirmed services (Voice Agent, Speed to Lead, Lead Reactivation,
Custom Agentic AI) from the earlier spec. This table's seed data needs
rewriting as part of the services-page work, not as part of this migration
— flagging so it isn't forgotten, not solving it here.

### `portfolio_items` (base collection)
`slug` (unique), `title`, `client_name`, `category`, `summary`,
`challenge`, `solution`, `outcome`, `images` (json, or `file` multi-upload
— see Storage), `aspect_ratio` (text, default `16/9`), `disclaimer`,
`services` (json — array of service slugs), `status` (select: draft/
published/archived), `sort_order` (number), `published_at` (date).

Rules: List/View — `status = "published" || @request.auth.id != ""`.
Create/Update/Delete — `@request.auth.id != ""`.

### `blog_posts` (base collection)
`slug` (unique), `title`, `excerpt`, `content_md` (text, required,
default ""), `cover_image_url` (text or `file`), `author_name`, `tags`
(json array), `category`, `featured` (bool), `view_count` (number,
default 0), `read_time_minutes` (number, default 5), `status` (select:
draft/published/archived), `published_at` (date).

Rules: List/View — `status = "published" || @request.auth.id != ""`.
Create/Update/Delete — `@request.auth.id != ""`.

`increment_blog_view(slug)` was a Postgres RPC — PocketBase has no
server-side RPC layer for arbitrary SQL, so this becomes a small
server-side function-route in the app (TanStack Start server fn) that does
a read-then-write against PocketBase using a service token, rather than an
atomic DB-side increment. Minor race-condition risk under concurrent
views; acceptable for a view counter.

### `clients` (base collection)
`company_name` (required), `contact_name`, `email`, `phone`,
`service_slug` (relation → `services`), `plan_tier` (select: basic/
standard/premium), `status` (select: active/paused/cancelled, default
active), `credit_balance` (number, default 0), `monthly_credit_allowance`
(number, default 0), `onboarding_date` (date), `notes`, `testimonial`
(text), `testimonial_published` (bool, default false), `logo_url` (text
or `file`).

Rules: List/View — `@request.auth.id != "" || testimonial_published =
true` (mirrors the two separate Supabase policies: admin-manage +
anon-read-published-testimonials). Create/Update/Delete —
`@request.auth.id != ""`.

Public testimonial reads must project only the public-safe fields
(`company_name, contact_name, testimonial, logo_url`) in the query, same
narrowing `listPublicTestimonials()` already does today — PocketBase
doesn't have Postgres's per-column grants, so this stays an
application-layer discipline, not a schema-enforced one, same as today's
"narrow projection enforced in code" comment on the original policy.

### `credit_transactions` (base collection)
`client_id` (relation → `clients`, required, cascade delete), `txn_type`
(select: grant/usage/adjustment/overage_recovery), `amount` (number),
`description`, `balance_after` (number, required).

Rules: List/View/Create/Update/Delete — `@request.auth.id != ""`.

### `approved_partners` (base collection)
`submission_id` (relation → `form_submissions`, nullable), `partner_type`
(select: agency/referral), `name` (required), `email`, `phone`, `company`,
`commission_rate` (number, default 0), `status` (select: active/paused/
terminated, default active), `notes`, `approved_at` (date).

Rules: List/View/Create/Update/Delete — `@request.auth.id != ""`.

### `form_submissions` (base collection)
`form_type` (required), `name`, `email`, `phone`, `company`, `message`,
`payload` (json, default `{}`), `status` (select: new/read/archived/
converted, default new).

Rules: Create — `` (empty/true — anyone can submit, matches "Anyone can
submit a form"). List/View/Update — `@request.auth.id != ""`. No public
read, matching today.

### `admin_audit_log` (base collection)
`actor_id`, `actor_email`, `action` (required), `entity_type`,
`entity_id`, `metadata` (json, default `{}`).

Rules: List/View/Create — `@request.auth.id != ""`. No Update/Delete rule
(append-only, matches today — Supabase policies only grant SELECT/INSERT).

### `waitlist` (base collection)
`email` (required), `product` (required).

Rules: Create — `` (anyone). List/View — `@request.auth.id != ""`.

---

## Storage (portfolio/blog images)

Today: Supabase Storage buckets (`portfolio-images`, `blog-images`),
uploaded through a custom signed endpoint (`api/admin.upload.ts`) that
checks the caller is an admin, uploads via the service-role client, and
returns a 10-year signed URL.

PocketBase handles file uploads natively as a field type on the record
itself (`file`, single or multi) — no separate bucket/signed-URL dance
needed, and PocketBase can be configured to use S3-compatible storage as
its backend. Since `synkra-core` already has Z1 (S3-compatible) storage
configured (`Z1_ACCESS_KEY_ID` etc. in its `.env.example`), the clean move
is: configure this new PocketBase instance's file storage settings to use
that same Z1 bucket (or a separate prefix/bucket within it), and change
`portfolio_items.images` / `blog_posts.cover_image_url` /
`clients.logo_url` / `admin_users.avatar_url` to native PocketBase `file`
fields. This deletes `api/admin.upload.ts` and its custom auth-check/
signed-URL logic entirely — PocketBase's own file-field access rules
(inherited from the collection's View rule) do that job.

---

## Auth architecture (pending Open Q1 answer)

Three Supabase client patterns today map to PocketBase like this:

- **`client.ts`** (browser, anon key) → PocketBase JS SDK instance
  pointed at `VITE_POCKETBASE_URL`, same pattern client-hub already uses.
- **`client.server.ts`** (server, service-role, bypasses RLS) →
  PocketBase JS SDK authenticated with a superuser/service token
  (`POCKETBASE_SERVICE_TOKEN`, already an env var in `synkra-core`'s
  `.env.example` — reuse that naming convention here).
- **`auth-middleware.ts`** (validates a per-request bearer JWT, scopes
  queries to that user) → PocketBase's own `authStore` + its JWT
  verification (`pb.collection('admin_users').authRefresh()` or manual
  JWT validation against PocketBase's auth token format) — structurally
  the same shape, different SDK calls.

I'm holding off writing the actual replacement code for these three files
(plus `admin.mfa.tsx`, `admin.login.tsx`, `public.functions.ts`,
`admin.functions.ts`, `admin.upload.ts`) until Open Q1 is answered, since
the MFA approach changes what `admin.mfa.tsx` and the auth middleware need
to do.
