# Admin Dashboard — TanStack Start Port

Building the full admin dashboard at `/admin/*` using this project's actual stack (TanStack Start + TanStack Query + Supabase). Same features, same UI, idiomatic code. Deferring `admin.synkra.co.za` subdomain to hosting-layer config later.

## Scope

Everything from your prompt, minus the Next.js-only pieces (`next.config.js` rewrites, `middleware.ts`, `@supabase/auth-helpers-nextjs`, `next/*`, RSC).

## Database (one migration)

New tables: `admin_users`, `portfolio_items`, `blog_posts`, `clients`, `credit_transactions`, `approved_partners`, `services`, plus `partner_applications` (referenced by `approved_partners` FK but not in your Day 4 schema — will create).

- Seeds the 8 services with the pricing you listed.
- RLS: public SELECT for `portfolio_items`/`blog_posts` where `status='published'` and `services` where `active=true`. All admin writes gated by a `has_role(user_id, 'admin')` check (proper role table, per platform rules), not `auth.role() = 'service_role'` as the prompt suggested.
- `updated_at` triggers.
- Storage buckets `portfolio-images` and `blog-images` (public, 10 MB, image types).

## Submissions table decision

The prompt references three separate tables (`contact_submissions`, `quote_requests`, `partner_applications`). Your Day 4 build uses a single `form_submissions` with `form_type` + `payload` JSONB.

**Plan:** keep `form_submissions` as the write target (no marketing-site changes), and have the admin Submissions/Partners pages read from it filtered by `form_type` (`contact`, `quote`, `partner_agency`, `partner_referral`). Add a `status` column to `form_submissions` for the new/read/archived workflow. Create `partner_applications` as a view over `form_submissions` so the `approved_partners` FK works cleanly.

## Auth architecture

- Path-based `/admin` (subdomain deferred).
- Sign-in via `supabase.auth.signInWithPassword`, then MFA via `supabase.auth.mfa` (TOTP). No `auth-helpers-nextjs`.
- Route gating: `src/routes/_admin/route.tsx` pathless layout with `ssr: false` and a client-side `beforeLoad` that checks: session exists → AAL2 achieved → user row exists in `admin_users`. Redirects to `/admin/login` or `/admin/mfa` accordingly.
- `/admin/login` and `/admin/mfa` are public (top-level routes).
- Dashboard routes live under `src/routes/_admin/admin.dashboard.*.tsx` so the layout gate protects the whole subtree; URLs still resolve to `/admin/dashboard/...`.
- Admin-only server fns use `requireSupabaseAuth` + `has_role(userId, 'admin')` check before doing privileged work with `supabaseAdmin` (loaded via `await import(...)` inside the handler, per import-graph rules).

## Routes

```text
src/routes/
  admin.tsx                      # redirects to /admin/login
  admin.login.tsx                # public — email/password
  admin.mfa.tsx                  # public — TOTP enroll / verify
  _admin/
    route.tsx                    # ssr:false gate, MFA + admin_users check
    admin.dashboard.tsx          # dashboard layout (sidebar + header + Outlet)
    admin.dashboard.index.tsx    # overview
    admin.dashboard.clients.tsx  # list
    admin.dashboard.clients.$id.tsx
    admin.dashboard.portfolio.tsx
    admin.dashboard.portfolio.$id.tsx
    admin.dashboard.blog.tsx
    admin.dashboard.blog.$id.tsx
    admin.dashboard.partners.tsx
    admin.dashboard.submissions.tsx
    admin.dashboard.services.tsx
    admin.dashboard.settings.tsx
  api/
    upload.ts                    # server route — image upload via supabaseAdmin
```

## Server functions

Grouped into `src/lib/admin.functions.ts` (thin — handlers only) with helpers in `src/lib/admin.server.ts`. All check `has_role('admin')`.

- `listClients`, `getClient`, `upsertClient`, `setClientStatus`, `addClientCredits`, `recoverClientOverage`
- `listPortfolio`, `getPortfolio`, `upsertPortfolio`, `deletePortfolio`, `togglePortfolioStatus`
- `listBlog`, `getBlogPost`, `upsertBlogPost`, `deleteBlogPost`
- `listSubmissions`, `updateSubmissionStatus`, `convertSubmissionToClient`
- `listApprovedPartners`, `approvePartnerApplication`, `rejectPartnerApplication`, `updatePartnerCommission`
- `listServices`, `upsertService`
- `listAdminUsers`, `inviteAdmin`, `removeAdmin`, `overviewStats`, `recentActivity`

Reads use TanStack Query pattern: `queryOptions()` → `ensureQueryData` in loader → `useSuspenseQuery` in component. Writes use `useMutation` + `useServerFn` + `invalidateQueries`.

## Components

```text
src/components/admin/
  layout/AdminSidebar.tsx
  layout/AdminHeader.tsx
  ui/AdminButton.tsx, AdminInput.tsx, AdminTable.tsx, AdminModal.tsx,
     AdminBadge.tsx, ImageUpload.tsx, RichTextEditor.tsx, ConfirmDialog.tsx
  charts/SubmissionsChart.tsx, ClientsChart.tsx    # recharts
  sections/OverviewStats.tsx, QuickActions.tsx, RecentActivity.tsx
```

`RichTextEditor` uses `@uiw/react-md-editor` inside a `<ClientOnly>` wrapper (TanStack equivalent of Next's `dynamic({ ssr: false })`).

## Design tokens

Admin tokens added to `src/styles.css` under `@theme` (v4 syntax, not `tailwind.config.ts` — this project doesn't have one). Semantic names: `--color-admin-bg`, `--color-admin-surface`, `--color-admin-border`, `--color-admin-accent`, plus text/status variants. Utility classes (`admin-card`, `admin-btn-primary`, `admin-input`, `admin-table`, `status-badge`, etc.) declared via `@utility`.

## Dependencies

`bun add qrcode.react @uiw/react-md-editor recharts react-hook-form @hookform/resolvers zod` (zod, RHF, and resolvers may already be installed — will check first). Skipping `@supabase/auth-helpers-nextjs`.

## Deferred / out of scope

- `admin.synkra.co.za` subdomain — needs Cloudflare route config after publish; can wire once you're ready.
- Email invites for new admins — Supabase `inviteUserByEmail` requires SMTP configured in Supabase; will wire the button but flag if SMTP isn't set up.
- Marketing site consuming the `services` table for dynamic pricing — separate task; current pricing page uses hardcoded values. Will note it as a follow-up rather than touch marketing pages in this build.

## Build order (single response batches)

1. Migration (waits on your approval, blocking the rest).
2. Deps + design tokens + storage buckets.
3. Auth pages (login, MFA) + `_admin` gate + shared admin UI primitives.
4. Dashboard layout + overview + charts.
5. Portfolio (list + editor + upload API + ImageUpload).
6. Blog (list + editor + RichTextEditor).
7. Clients (list + detail with credits/status).
8. Submissions + Partners.
9. Services + Settings.
10. Typecheck + smoke test each route with curl.

This is a big build — expect it to span multiple turns after migration approval.
