# synkra--web-main: PocketBase Schema

Every collection this repo's own PocketBase instance actually needs,
derived directly from the code that reads/writes each one (not from
memory or the older, now-stale `POCKETBASE-MIGRATION-PLAN.md`, which
predates several of these collections and is superseded by this file).
This is web-main's **own** dedicated instance - not the same one as
`synkra-client-hub` (Flow/Chat) or the new dedicated Agency instance
(`synkra-agency-client-portal`).

Two real findings from this audit are flagged inline where they come
up, and summarised again at the end - not fixed here, since both are
judgement calls, not bugs with one obvious correct code answer.

---

## `admin_users` (auth collection)

The people who can sign into `/admin`. No `role` field - every record
here is an admin, full stop (per `_admin.tsx`'s own beforeLoad comment).

| Field | Type | Notes |
|---|---|---|
| `email` | email | auth built-in |
| `password` | password | auth built-in. Invites work by creating the record with a throwaway password, then immediately calling `requestPasswordReset` - there's no PocketBase equivalent of Supabase's invite-by-email API |
| `full_name` | text | nullable |
| `verified` | bool | auth built-in, set `true` on invite |
| `last_sign_in_at` | date | updated on every successful admin session check |

MFA is PocketBase's native email-OTP (not TOTP) - a collection-level
auth setting, not a field on this table.

## `admin_audit_log`

Append-only. Every mutating admin action writes one row here (see
`audit()` in `admin.functions.ts`).

| Field | Type | Notes |
|---|---|---|
| `actor_id` | text | the admin_users id who did it |
| `actor_email` | text | nullable, denormalised for readability without a join |
| `action` | text | e.g. `partner.approve`, `client.credits_grant`, `submission.status_change` - freeform, not an enum |
| `entity_type` | text | e.g. `client`, `approved_partner`, `form_submission` |
| `entity_id` | text | |
| `metadata` | json | action-specific details |

## `clients`

**Flag:** doubles as (a) a lightweight admin CRM for tracking Agency
service clients and their credit balance, and (b) the data source for
the public homepage Testimonials section (`listPublicTestimonials` in
`public.functions.ts` reads this collection directly, filtered on
`testimonial_published = true`). This predates `synkra-core` and the
dedicated `synkra-agency-client-portal` instance - there's now real
overlap between this collection's client/credit tracking and that
system's `agency_clients`/`agency_usage_credits`. Not resolved here -
see the summary at the bottom.

| Field | Type | Notes |
|---|---|---|
| `company_name` | text | required |
| `contact_name` | text | nullable |
| `email` | email | nullable |
| `phone` | text | nullable |
| `service_slug` | text | nullable |
| `plan_tier` | select | `basic` \| `standard` \| `premium` - note: this is the OLD tier naming, doesn't match Flow's current `free`/`basic`/`pro` or Custom AI Systems' `Essential`/`Growth`/`Advanced` |
| `monthly_credit_allowance` | number | int, default 0 |
| `credit_balance` | number | int, adjusted by `addClientCredits` |
| `status` | select | referenced via `updateClientStatus`, exact enum not pinned down further than "a status string" in the code I could find |
| `notes` | text (long) | nullable, internal |
| `testimonial` | text (long) | nullable |
| `testimonial_published` | bool | gates public display |
| `logo_url` | text | nullable |

## `credit_transactions`

Append-only ledger for `clients.credit_balance` changes.

| Field | Type | Notes |
|---|---|---|
| `client_id` | text (relation to `clients`) | |
| `txn_type` | select | `grant` \| `adjustment` \| `overage_recovery` |
| `amount` | number | int, signed |
| `description` | text | required |
| `balance_after` | number | int, snapshot at time of transaction |

## `services`

**Flag, more concrete than the `clients` one above: this collection is
currently dead relative to the live site.** Only `admin.functions.ts`'s
`listServicesAdmin`/`upsertService` touch it, both gated behind
`/admin/dashboard/services` - nothing on the public site reads it.
Actual pricing shown to visitors comes entirely from the static
`src/data/serviceContent.ts` and `src/data/pricingTiers.ts` files. An
admin editing pricing here today would see it save successfully with
zero effect on what anyone actually sees - worth fixing (either wire
this collection into being the real read path, a bigger change, or add
a clear "not connected to the live site" notice on that admin page
until it's reconciled one way or the other).

| Field | Type | Notes |
|---|---|---|
| `setup_fee` | number | int |
| `monthly_basic` | number | int, nullable |
| `monthly_standard` | number | int, nullable |
| `monthly_premium` | number | int, nullable - same old basic/standard/premium naming as `clients.plan_tier` above |
| `usage_rate` | number | nullable |
| `usage_unit` | text | nullable |
| `active` | bool | |
| `sort_order` | number | int, used for admin list ordering |

## `blog_posts`

| Field | Type | Notes |
|---|---|---|
| `slug` | text | required, `^[a-z0-9-]+$` |
| `title` | text | required |
| `excerpt` | text | nullable |
| `content_md` | text (long) | markdown, default `""` |
| `cover_image_url` | text | nullable |
| `author_name` | text | nullable |
| `tags` | json (array of strings) | default `[]` |
| `status` | select | `draft` \| `published` \| `archived` |
| `published_at` | date | set automatically when status becomes `published` |

## `portfolio_items`

| Field | Type | Notes |
|---|---|---|
| `slug` | text | required, `^[a-z0-9-]+$` |
| `title` | text | required |
| `client_name` | text | nullable |
| `category` | text | nullable |
| `summary` | text | nullable |
| `challenge` | text (long) | nullable |
| `solution` | text (long) | nullable |
| `outcome` | text (long) | nullable |
| `images` | json (array of strings) | default `[]` - `media` record ids |
| `aspect_ratio` | text | nullable |
| `disclaimer` | text | nullable |
| `services` | json (array of strings) | default `[]` - service slugs, used by `portfolio.ts`'s filter list |
| `status` | select | `draft` \| `published` \| `archived` |
| `sort_order` | number | int, default 0 |

## `media`

Generic file storage for portfolio and blog images (replaced a
Supabase Storage bucket - see `api/admin.upload.ts`'s own header
comment, already documents this collection).

| Field | Type | Notes |
|---|---|---|
| `bucket` | select | `portfolio-images` \| `blog-images` |
| `filename` | text | sanitised (`[^a-zA-Z0-9._-]` stripped) before upload |
| `file` | file | the actual native PocketBase file field |

Rules: List/View public (`""`), Create/Update/Delete left unset
(superuser-only, called via the admin-authenticated upload API route,
never directly from the browser).

## `form_submissions`

Every public form on the site writes here: Contact, Talk to Us,
Partner (Agency/Referral).

| Field | Type | Notes |
|---|---|---|
| `form_type` | text | not an enforced enum in the schema, but every current caller uses one of: `contact`, `talk_to_us`, `partner_agency`, `partner_referral` |
| `name` | text | nullable |
| `email` | email | nullable |
| `phone` | text | nullable |
| `company` | text | nullable |
| `message` | text (long) | nullable |
| `payload` | json | form-specific extra fields, default `{}` |
| `status` | select | `new` \| `read` \| `archived` \| `converted` |

Rules: Create public (`""`) - "anyone can submit a form" is the whole
point.

## `approved_partners`

Created when an admin approves a `form_submissions` row of type
`partner_agency`/`partner_referral`.

| Field | Type | Notes |
|---|---|---|
| `submission_id` | text | the originating `form_submissions` id |
| `partner_type` | select | `agency` \| `referral` |
| `name` | text | required |
| `email` | email | nullable |
| `phone` | text | nullable |
| `company` | text | nullable |
| `commission_rate` | number | 0-100, default 0 |
| `status` | select | `active` \| `paused` \| `terminated` |

## `integration_partner_applications`

Already fully documented in this repo's own
`INTEGRATION-PARTNER-FEATURE.md` (§ "New PocketBase collection") - not
repeated here to avoid two documents drifting out of sync. Short
version: the full 11-section application form (company, contact,
platform, technical, capabilities, existing integrations, interest,
customer base, technical contact, pricing model, consent), plus
`ai_score`/`ai_flag`/`ai_category_scores`/`ai_strengths`/`ai_risks`/
`ai_scoring_error` written by the AI scoring pass in
`aiScoring.server.ts`.

## `waitlist`

| Field | Type | Notes |
|---|---|---|
| `email` | email | required |
| `product` | text | e.g. `chat`, or an industry-page slug like `industries-trades` (see `WaitlistForm`'s `product` prop usage across the site) |

Rules: Create public (`""`).

---

## Summary of the two open flags

1. **`services` is disconnected from the live site.** Pricing is read
   from `serviceContent.ts`/`pricingTiers.ts` everywhere it's actually
   shown to a visitor; the PocketBase collection only feeds its own
   admin CRUD page, which currently misleads whoever uses it into
   thinking their edits matter. Needs a decision: wire it in for real,
   or mark the admin page as inert until it's reconciled.
2. **`clients`/`credit_transactions` overlap with the newer Agency
   Portal system** (`agency_clients`/`agency_usage_credits` on the
   dedicated Agency instance), but `clients` also uniquely serves the
   public Testimonials section, so it isn't simply redundant - it may
   be worth splitting into a smaller `testimonials`-only collection
   here (marketing content) and moving the actual client/credit/billing
   tracking fully onto the Agency Portal instance, where the newer,
   more complete system for that already exists.

Neither was fixed in code as part of writing this document - both are
real design decisions, not bugs with one obvious right answer, and I'd
rather flag them clearly than guess.
