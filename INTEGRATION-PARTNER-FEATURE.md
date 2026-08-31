# Integration Partner Application — Feature Notes

## Housekeeping first
`src/lib/public.server.ts` and `src/lib/admin.server.ts` aren't in the repo
snapshot I have, so I can't rewrite them — but since you've confirmed
nothing calls either one, the correct fix is simpler than a rewrite:
**delete both files.** Nothing replaces them.

---

## New PocketBase collection: `integration_partner_applications`

One collection holds the full form. Long, but it's one submission per
record and every field maps directly to a form field below — no reason to
split it across tables.

**Fields** (all text/select/bool/number/json unless noted):
- Company: `company_name`, `website`, `country`, `primary_markets` (json array), `industry` (select), `company_size` (select: 1-10|11-50|51-200|201-500|500+)
- Contact: `contact_name`, `contact_title`, `contact_email`, `contact_phone`, `preferred_contact_method`
- Platform: `platform_name`, `platform_description`, `platform_categories` (json array, multi-select), `platform_users` (json array, multi-select + other), `geographic_market` (json array)
- Integration capability: `has_api` (select: yes|no|in_development|not_sure), `api_docs_url`, `api_type` (select), `has_webhooks` (select: yes|no|not_sure), `auth_type` (select), `has_dev_portal` (select: yes|no), `dev_docs_url`
- Exposable data/actions: `exposable_actions` (json array — the checkbox tree), `other_capabilities` (text)
- Existing ecosystem: `existing_integrations` (json array), `existing_integrations_other` (text), `has_marketplace` (select: yes|no|planned), `has_third_party_devs` (select: yes|no|not_sure)
- Partnership interest: `interest_types` (json array), `why_partner` (text), `desired_integration_outcome` (text)
- Customer overlap: `customer_count_range` (select), `sa_customer_percentage` (select), `customer_business_types` (text)
- Technical contact (conditional on `has_api != "no"`): `tech_contact_name`, `tech_contact_email`, `sandbox_available` (select: yes|no), `test_credentials_available` (select: yes|no), `dev_account_available` (select: yes|no)
- Commercial: `access_pricing_model` (select), `has_additional_third_party_costs` (select: yes|no|not_sure), `has_partner_pricing` (select: yes|no|under_discussion), `has_referral_program` (select: yes|no), `referral_program_details`
- Consent: `consent_accurate` (bool, required true), `consent_marketing` (bool)
- **AI scoring** (written by the server, never by the client — see below): `ai_score` (number, 0-100), `ai_flag` (select: high_priority|worth_reviewing|monitor|low_priority), `ai_category_scores` (json — per-category breakdown), `ai_strengths` (json array), `ai_risks` (json array), `ai_missing_information` (json array), `ai_summary` (text), `ai_scored_at` (date), `ai_scoring_error` (text, nullable — set if scoring failed, so a failed score isn't silently indistinguishable from a low one)
- Admin review status (separate from the AI flag on purpose — the AI never decides this): `status` (select: new|reviewing|contacted|approved|declined, default `new`)

**Access rules:**
- Create: `""` (public — anyone can submit)
- List/View/Update/Delete: `@request.auth.id != ""` (admin only)

This mirrors `form_submissions`' public-create/admin-read pattern exactly,
just with a dedicated shape instead of a generic `payload` blob — worth it
here given how structured and reviewable this data needs to be on the
admin side.

---

## AI scoring — architecture

**Runs synchronously on submission**, inside the same server function that
creates the record, wrapped in its own try/catch so a scoring failure
never blocks the actual submission from succeeding — the record still
gets created with `status: "new"`, just with `ai_scoring_error` set and
`ai_flag` left empty, so a human sees "not scored" rather than a
misleadingly blank/zero score.

**Provider: Ollama, already running on the server** (corrected from an
initial Anthropic API build — not Kimi either, which is Flow's cost-
optimized customer-facing AI engine for a different reason; this is a
one-off internal judgment call per submission, not a per-message cost
center, and the rubric requires genuine qualitative reasoning across 8
weighted categories). Needs `OLLAMA_BASE_URL` and `OLLAMA_MODEL` set —
`OLLAMA_MODEL` must match whatever's actually pulled on that instance,
`.env.example`'s `llama3.1` is a placeholder, not a recommendation. Uses
Ollama's `format: "json"` mode so the response is constrained to valid
JSON server-side.

**Flag thresholds** — you gave the point breakdown per category (sums to
100) but not the score-to-flag cutoffs, so I've set reasonable defaults,
adjust freely in `aiScoring.server.ts`:
- 🟢 High Priority: 75-100
- 🟡 Worth Reviewing: 50-74
- 🔵 Monitor: 25-49
- 🟠 Low Priority: 0-24

**The AI never sets `status`** — only `ai_flag`, `ai_score`,
`ai_category_scores`, `ai_strengths`, `ai_risks`,
`ai_missing_information`, `ai_summary`. `status` starts at `"new"` and is
only ever changed by an admin, matching "AI flags, human decides."

**Admin visibility**: added `listIntegrationPartnerApplications` to
`admin.functions.ts`'s pattern (new file, same shape) so the AI's output
is queryable — no dashboard UI page built yet, since you said the
dashboard/notification piece is a later conversation. This just makes the
data reachable when you're ready for that.

---

## Confirmation email

**Provider: Resend**, via a plain HTTP call to their API (no SDK
dependency needed for one email type) — matching what `synkra-client-hub`
already uses, so the ecosystem stays on one email provider rather than
introducing a second. Needs `RESEND_API_KEY` and `RESEND_FROM_EMAIL` in
web-main's env (new — web-main didn't send transactional email before
this).

Content is deliberately minimal per your instruction: contact name and
company name only, not a copy of the full submission. Sent to
`contact_email`, fire-and-forget with its own try/catch (a failed email
must never fail the submission itself).

---

## Env vars added (update `.env.example` with these)
```
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.1
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=partnerships@synkra.co.za
```
