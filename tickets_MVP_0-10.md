# rolik.io — MVP 0→10 Ticket Backlog

This file turns the PRD build plan (Levels 0→10) into actionable tickets.

## Conventions
- **Type**: FE (frontend), BE (backend/API), DB (database), INFRA (hosting/storage/secrets), OPS (ops/monitoring), COPY (copy/legal/email)
- **AC** = acceptance criteria
- **Deps** = dependencies

## Global decisions captured (current)
- **Stack (cheap + production-viable)**:
  - Next.js (Vercel)
  - Supabase: Postgres + Auth (magic links)
  - Cloudflare R2: raw + delivery files (S3-compatible presigned uploads + signed downloads)
  - Stripe Checkout + webhooks
  - Resend for emails
  - Vercel Cron (daily) for retention cleanup
- **Packaging**:
  - Keep Tier A/B/C (length + raw limits + included revisions)
  - Add **Editing Level**:
    - **Basic**: standard editing (no hard effects), internal time budget target ~≤60 min
    - **Enhanced**: standard editing but more polish (still no hard effects), internal time budget target ~≤120 min
    - **Pro/Complex**: hard effects / advanced requests → **quote-only** (manual pricing + due date)

---

## Level 0 — Repo & foundations

### L0-01 (INFRA) Initialize Next.js + TS + repo structure
- **Scope**: Create app skeleton, directory layout, basic CI-ready scripts.
- **AC**:
  - App boots locally
  - `pnpm dev` (or `npm dev`) runs without errors
  - Basic routes: `/` and `/pricing` render

### L0-02 (INFRA) Environment + secrets strategy
- **Scope**: Define required env vars and how they map to providers (Supabase, Stripe, R2, Resend).
- **AC**:
  - `.env.example` contains all required keys (no secrets)
  - Documented per-provider setup steps in README section (minimal)

### L0-03 (FE) UI foundation (mobile-first)
- **Scope**: Add styling system (Tailwind or equivalent), base layout, buttons, forms, toasts.
- **AC**:
  - Wizard-ready components exist: `Button`, `Input`, `Select`, `Toggle`, `Progress`, `Card`
  - Lighthouse mobile usability: no obvious layout breakpoints

### L0-04 (INFRA) Provider project setup checklist (non-code)
- **Scope**: Create accounts/projects: Supabase project, Cloudflare R2 bucket, Stripe test keys, Resend domain.
- **AC**:
  - A checklist section exists in repo docs (or ticket notes) with URLs and required values

---

## Level 1 — DB & migrations

### L1-01 (DB) Create schema migrations (PRD tables)
- **Scope**: Add migrations for:
  - `users`
  - `orders`
  - `order_assets`
  - `order_references`
  - `messages`
  - `deliveries`
  - `status_history`
- **AC**:
  - Can apply migrations to local/dev DB
  - Constraints: FK relationships, required fields, indexes on `orders.status`, `orders.created_at`, `orders.email`, `messages.order_id`

### L1-02 (DB) Add fields for Editing Level + Pro quote
- **Scope**: Extend `orders` with:
  - `editing_level` (basic|enhanced|pro)
  - quote metadata: `quote_requested_at`, `quoted_price_cents`, `quoted_due_at`, `quoted_at` (and optional `quoted_by`)
- **AC**:
  - DB enforces allowed `editing_level` values
  - Quote fields nullable for Basic/Enhanced orders

### L1-03 (DB) Add Stripe idempotency tables
- **Scope**: Add `stripe_events` (or similar) table:
  - `event_id` unique
  - `type`, `created`, `payload_json`, `processed_at`
- **AC**:
  - Webhook handler can safely ignore duplicate deliveries

### L1-04 (BE) DB access layer
- **Scope**: Implement a small DB module for server-only queries (SQL client / query builder).
- **AC**:
  - Centralized DB connection
  - Basic CRUD helpers for `orders` and `order_assets`

---

## Level 2 — Presigned uploads (R2) + asset registration

### L2-01 (INFRA) Create R2 bucket + CORS policy
- **Scope**: Configure R2 bucket(s) and CORS for browser PUT uploads via presigned URLs.
- **AC**:
  - Browser upload works from localhost and prod domain
  - Only required methods/headers allowed

### L2-02 (BE) `POST /api/uploads/presign` for R2 PUT
- **Scope**: Return presigned PUT URLs for client uploads; restrict content-type where possible.
- **AC**:
  - Request validates: file kind, mime type, max size, order ownership
  - Presign expiry is short (e.g. 10–30 min)
  - Object keys are namespaced by `order_id`

### L2-03 (FE) Upload component with progress + retry
- **Scope**: Multi-file uploader for video/image/voice/logo.
- **AC**:
  - Shows per-file progress bar
  - Retry failed file without restarting entire wizard
  - Prevents navigation away with in-flight uploads (or warns)

### L2-04 (BE) `POST /api/orders/:id/assets` register metadata
- **Scope**: After upload completes, client posts metadata to create `order_assets`.
- **AC**:
  - Server validates object key prefix, size, mime type, kind
  - Stores duration if provided (client may not know duration reliably; allow null)

### L2-05 (FE) Raw duration limit UX
- **Scope**: Display “raw used vs limit” with enforcement.
- **AC**:
  - User sees tier limit and current usage
  - Cannot proceed if no files uploaded

---

## Level 3 — Order wizard + DRAFT orders

### L3-01 (FE) Step 1 “Choose” screen
- **Scope**: Platform (IG/TikTok/Shorts), Tier A/B/C, vibe cards, add-ons, editing level Basic/Enhanced/Pro.
- **AC**:
  - Mobile-first, fast to complete
  - Summary panel shows price estimate and constraints
  - If user selects **Pro**, UI indicates “quote required”

### L3-02 (BE) `POST /api/orders` create DRAFT order
- **Scope**: Create `orders` row with status `DRAFT` and calculated limits:
  - raw_limit_seconds, revisions_included
- **AC**:
  - Validates tier + add-ons compatibility
  - Persists `editing_level`

### L3-03 (FE) Step 2 “Upload” screen
- **Scope**: Uses L2 uploader + shows constraints.
- **AC**:
  - User cannot continue until ≥1 asset registered
  - Shows used vs limit indicator

### L3-04 (FE) Step 3 “Brief” screen
- **Scope**: Required “What do you want?”, optional fields, up to 5 reference links, optional voice note.
- **AC**:
  - Validates required brief
  - Stores references

### L3-05 (BE) Save brief + references
- **Scope**: Update `orders` with brief fields and create `order_references`.
- **AC**:
  - References validated as URLs
  - Status transitions to `AWAITING_PAYMENT` (or `QUOTE_REQUESTED` for Pro)

### L3-06 (BE/FE) Pro flow: request quote (no checkout yet)
- **Scope**:
  - If `editing_level=pro`, after brief submission → status `QUOTE_REQUESTED`
  - Client portal shows “Quote pending”
- **AC**:
  - Pro orders do not allow checkout until quoted
  - Admin sees Pro orders clearly flagged

---

## Level 4 — Payments + webhook (Stripe)

### L4-01 (BE) `POST /api/orders/:id/checkout` create Stripe Checkout
- **Scope**: Create checkout session for Basic/Enhanced orders; for Pro only after quote is set.
- **AC**:
  - Prevents duplicate sessions (reuse existing pending session)
  - Passes `order_id` in metadata
  - Handles cancel/success redirects safely

### L4-02 (BE) `POST /api/stripe/webhook` verification + idempotency
- **Scope**: Verify signature, store event id, process relevant events.
- **AC**:
  - Duplicate events do not create duplicate transitions
  - On payment success: order → `PAID`, set `stripe_*` ids

### L4-03 (BE) SLA `due_at` calculation rules
- **Scope**: Compute `due_at` based on tier + rush add-on + (optional) editing level.
- **AC**:
  - SLA starts only when payment + uploads complete + brief exists (PRD)
  - Stored on order at `PAID`

### L4-04 (COPY/BE) Payment confirmation email
- **Scope**: Send email “payment received” with portal link.
- **AC**:
  - Email sent exactly once per order payment

---

## Level 5 — Client portal + timeline (magic link)

### L5-01 (INFRA/BE) Supabase Auth: magic link sign-in
- **Scope**: Implement auth flow and session cookie handling.
- **AC**:
  - User can request magic link and sign in
  - Session persists across refresh

### L5-02 (BE) `GET /api/orders/:id` (authz + data shape)
- **Scope**: Return order detail, assets list, references, messages, deliveries, status history.
- **AC**:
  - Only order owner can view
  - Response includes revision quota counters and timeline items

### L5-03 (FE) Order detail page (status timeline + summary)
- **Scope**: Display status machine, due date, constraints, uploaded assets list.
- **AC**:
  - Shows current status and history
  - Clear next action: wait / approve / request revision

### L5-04 (FE/BE) Messaging thread
- **Scope**: Client can send messages; admin replies (admin UI later).
- **AC**:
  - New messages appear without full refresh (polling ok for MVP)
  - Messages persisted with sender type

### L5-05 (BE) Signed download links for assets/deliveries
- **Scope**: Generate short-lived signed GET URLs for R2 objects.
- **AC**:
  - URLs expire (e.g. 10–60 min)
  - Only owner/admin can request

---

## Level 6 — Admin dashboard (ops)

### L6-01 (BE) Admin auth allowlist
- **Scope**: Protect `/admin` routes and admin API endpoints by email allowlist.
- **AC**:
  - Non-allowlisted users cannot access admin
  - Allowlist stored in env or DB (documented)

### L6-02 (FE) Admin orders list with filters + SLA risk
- **Scope**: List orders; filter by status, tier, editing level; show “due soon/overdue”.
- **AC**:
  - Can quickly find Pro quote requests
  - SLA risk indicator visible

### L6-03 (FE/BE) Admin order detail view
- **Scope**: Show assets, brief, references, messages, status history, deliveries.
- **AC**:
  - Admin can change status safely (with audit entry)
  - Admin can add internal notes (optional MVP)

### L6-04 (BE) Admin endpoints
- **Scope**:
  - `GET /api/admin/orders`
  - `GET /api/admin/orders/:id`
  - `POST /api/admin/orders/:id/status`
  - `POST /api/admin/orders/:id/assign`
- **AC**:
  - All endpoints protected by admin auth
  - Status changes create `status_history` entries

### L6-05 (FE/BE) Pro quote tool (admin)
- **Scope**: Admin sets `quoted_price_cents` + `quoted_due_at`, transitions `QUOTE_REQUESTED -> QUOTED`.
- **AC**:
  - Client sees quote in portal and can proceed to checkout
  - Quote changes are auditable

---

## Level 7 — Deliveries (versioned) + client review

### L7-01 (BE) Admin delivery upload presign (R2)
- **Scope**: Presign PUT for delivery file; store as `deliveries` with `version_number`.
- **AC**:
  - Version increments per order
  - Delivery record includes duration if known

### L7-02 (FE) Admin “Upload delivery” UI
- **Scope**: Upload final reel file and create delivery.
- **AC**:
  - Shows progress + success state
  - Prevents wrong file types

### L7-03 (FE) Client delivery preview + download
- **Scope**: Show latest delivery, provide signed download link.
- **AC**:
  - Client can play preview (if using signed URL) and download
  - Clear buttons: Approve / Request revision

### L7-04 (COPY/BE) “Delivered” email notification
- **Scope**: Send email when status becomes `DELIVERED`.
- **AC**:
  - Sent once per delivery version (or once per status change)

---

## Level 8 — Revisions + enforcement

### L8-01 (FE) Request revision UI
- **Scope**: Checkbox categories + free text + optional timestamp notes.
- **AC**:
  - User sees remaining included revisions
  - Cannot submit empty revision request

### L8-02 (BE) `POST /api/orders/:id/request-revision`
- **Scope**: Enforce quota; transition to `REVISION_REQUESTED`; increment `revisions_used`.
- **AC**:
  - If quota exceeded: block (or show manual upsell message)
  - Creates status history

### L8-03 (FE/BE) Admin revision handling
- **Scope**: Admin can set `REVISION_IN_PROGRESS` and upload a new delivery version.
- **AC**:
  - Status transitions follow PRD
  - Delivery v2 triggers client notification

### L8-04 (BE) `POST /api/orders/:id/approve` close order
- **Scope**: Client approves; status → `COMPLETED`.
- **AC**:
  - Prevent approval without at least one delivery
  - Creates status history

---

## Level 9 — Notifications + retention hooks

### L9-01 (COPY/BE) Email templates for all key events
- **Scope**: Payment, in-progress, delivered, revision delivered, completed.
- **AC**:
  - Consistent branding/copy
  - Includes portal link and order summary

### L9-02 (BE) Notification triggers on status changes
- **Scope**: Centralize status transition helper that triggers emails.
- **AC**:
  - Each status transition is idempotent and email-safe
  - No duplicate emails on retries

### L9-03 (OPS/INFRA) Daily retention job (Vercel Cron)
- **Scope**: Daily job deletes:
  - raw assets 30d after completion
  - deliveries 90d after completion
- **AC**:
  - Job logs summary counts
  - Safe delete (only keys that match completed orders)

### L9-04 (BE) Admin override: re-send emails / extend retention (optional)
- **Scope**: Minimal controls for support.
- **AC**:
  - Only admin can trigger

---

## Level 10 — Launch hardening

### L10-01 (OPS) Rate limiting + abuse protection
- **Scope**: Rate limit presign endpoint, magic-link requests, order creation.
- **AC**:
  - Basic abuse cases blocked
  - Legit users not impacted at low volume

### L10-02 (OPS) Logging + error tracking
- **Scope**: Add structured logs; integrate Sentry (or equivalent).
- **AC**:
  - Errors include `order_id` context when applicable
  - Stripe webhook failures are visible

### L10-03 (OPS) Security review checklist
- **Scope**: Validate storage privacy, signed URL TTLs, webhook signature checks.
- **AC**:
  - No public access to raw uploads
  - Webhooks verified
  - Admin routes protected

### L10-04 (FE/COPY) Public site launch polish
- **Scope**: Home/Pricing/How/FAQ/Terms/Privacy; clear constraints and SLA.
- **AC**:
  - Constraints (raw limits, revision limits, no music delivery) visible on Pricing
  - CTA to start wizard is obvious

### L10-05 (OPS) Basic metrics instrumentation
- **Scope**: Track: start order, upload complete, checkout started, checkout success, delivered, approved.
- **AC**:
  - Metrics visible in chosen analytics tool (or basic DB event log)

---

## Cross-cutting tickets (apply across levels)

### X-01 (BE) Status machine helper + audit logging
- **Scope**: Central function for transitions that writes `status_history` and triggers notifications.
- **AC**:
  - Disallows invalid transitions
  - Always writes history rows

### X-02 (FE) “Constraints UI” components
- **Scope**: Reusable UI snippets showing: raw limit, revisions included, SLA, music policy.
- **AC**:
  - Used on Pricing page and in wizard summary

### X-03 (BE) Price calculation module
- **Scope**: Single source of truth for price of tier + add-ons + editing level; Pro uses quote.
- **AC**:
  - Same calculation used in UI estimate and server checkout creation

