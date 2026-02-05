# rolik.io — MVP 0→10 Ticket Backlog (v2 — Agency + Subscriptions)

This file turns the PRD build plan (Levels 0-10) into actionable tickets.

## Conventions
- **Type**: FE (frontend), BE (backend/API), DB (database), INFRA (hosting/storage/secrets), OPS (ops/monitoring), COPY (copy/legal/email)
- **AC** = acceptance criteria
- **Deps** = dependencies
- **Status**: DONE = already implemented, NEW = added in v2 pivot, UPDATED = scope changed from v1

## Global decisions captured

**Stack (unchanged):**
- Next.js (Vercel)
- Supabase: Postgres + Auth (magic links)
- Cloudflare R2: raw + delivery file storage
- Stripe Checkout (one-off) + Stripe Billing (subscriptions)
- Resend for emails
- Vercel Cron (daily) for retention cleanup

**Business model:**
- Subscriptions: Starter ($299/mo, 8 pieces) and Growth ($599/mo, 20 pieces)
- One-off: Quick Reel $59, Standard Reel $89, Full Reel $159, Photo Edit packages
- Content types: reels, photos, carousels, stories
- Content suggestions: caption + song recommendation per piece (subscribers)

---

## Level 0 — Repo and foundations (DONE)

### L0-01 (INFRA) Initialize Next.js + TS + repo structure — DONE
### L0-02 (INFRA) Environment + secrets strategy — DONE
### L0-03 (FE) UI foundation (mobile-first) — DONE
### L0-04 (INFRA) Provider project setup checklist — DONE

---

## Level 1 — DB and migrations

### L1-01 (DB) Create schema migrations (v1 tables) — DONE
- orders, order_assets, order_references, messages, deliveries, status_history, stripe_events

### L1-02 (DB) Add fields for editing level + pro quote — DONE

### L1-03 (DB) Add Stripe idempotency table — DONE

### L1-04 (BE) DB access layer — DONE

### L1-05 (DB) Add subscriptions table — NEW
- **Scope**: Create `subscriptions` table with: id, user_id, email, plan (starter/growth), status (active/past_due/canceled), pieces_per_month, pieces_used_this_period, revisions_per_piece, shared_folder_url, stripe_subscription_id, stripe_customer_id, current_period_start, current_period_end, canceled_at, created_at, updated_at
- **AC**:
  - Migration applies cleanly
  - Indexes on user_id, status, stripe_subscription_id

### L1-06 (DB) Add content_pieces table — NEW
- **Scope**: Create `content_pieces` table with: id, subscription_id, user_id, email, type (reel/photo/carousel/story), status enum, revisions_included, revisions_used, suggested_caption, suggested_song_name, suggested_song_artist, suggested_song_url, suggested_post_date, due_at, created_at, updated_at
- **AC**:
  - Status enum: raw_received, in_review, in_progress, delivered, revision_requested, revision_in_progress, approved, ready_to_post, skipped
  - FK to subscriptions
  - Indexes on subscription_id, status, due_at

### L1-07 (DB) Add content_piece_assets and content_piece_deliveries tables — NEW
- **Scope**: Create asset and delivery tables for content pieces (same shape as order_assets/deliveries but FK to content_pieces)
- **AC**:
  - content_piece_assets: id, content_piece_id, kind, storage_key, filename, mime_type, size_bytes, duration_seconds, created_at
  - content_piece_deliveries: id, content_piece_id, version_number, storage_key, filename, duration_seconds, created_at
  - Indexes on content_piece_id

### L1-08 (DB) Add brief fields to orders — DONE
- brief_want, brief_avoid, brief_must_include columns

### L1-09 (DB) Add content_type field to orders — NEW
- **Scope**: Add `content_type` (reel/photo/carousel/story) to orders table for one-off photo editing support
- **AC**: Column added with default "reel" for backward compatibility

---

## Level 2 — Presigned uploads (DONE)

### L2-01 (INFRA) Create R2 bucket + CORS — DONE
### L2-02 (BE) POST /api/uploads/presign — DONE
### L2-03 (FE) Upload component with progress + retry — DONE
### L2-04 (BE) POST /api/orders/:id/assets — DONE
### L2-05 (FE) Raw duration limit UX — DONE

---

## Level 3 — Order wizard + DRAFT orders (DONE, needs update)

### L3-01 (FE) Step 1 "Choose" screen — UPDATED
- **Scope**: Add content type selector (Reel or Photo Edit) before platform/tier/vibe selection
- **AC**: If Photo Edit, show photo packages instead of reel tiers

### L3-02 (BE) POST /api/orders — DONE (needs content_type field)
### L3-03 (FE) Step 2 "Upload" screen — DONE
### L3-04 (FE) Step 3 "Brief" screen — DONE
### L3-05 (BE) Save brief + references — DONE
### L3-06 (BE/FE) Pro flow: request quote — DONE

---

## Level 4 — Payments (one-off + subscription)

### L4-01 (BE) POST /api/orders/:id/checkout — Stripe one-off checkout — DONE (stub)
### L4-02 (BE) POST /api/stripe/webhook — one-off payment verification — DONE (stub)
### L4-03 (BE) SLA due_at calculation — DONE (stub)
### L4-04 (COPY/BE) Payment confirmation email — pending

### L4-05 (BE) Stripe Billing: subscription checkout — NEW
- **Scope**: Create endpoint `POST /api/subscriptions/checkout` that creates a Stripe Checkout session in subscription mode for Starter or Growth plan
- **AC**:
  - Creates Stripe Customer if needed
  - Creates Checkout session with correct price ID
  - Stores stripe_customer_id and stripe_subscription_id on success
  - Redirects to success/cancel pages

### L4-06 (BE) Stripe webhook: subscription events — NEW
- **Scope**: Handle subscription lifecycle events in existing webhook handler: customer.subscription.created, updated, deleted, invoice.payment_failed
- **AC**:
  - Creates/updates subscription row on creation
  - Sets status to past_due on payment failure
  - Sets status to canceled on deletion
  - Resets pieces_used_this_period on renewal (invoice.paid with billing_reason=subscription_cycle)

### L4-07 (FE) Subscription checkout page — NEW
- **Scope**: Page at /subscribe with plan selection (Starter/Growth) and Stripe checkout redirect
- **AC**:
  - Shows both plans with features comparison
  - "Subscribe" button creates session and redirects to Stripe
  - Success page redirects to onboarding

---

## Level 5 — Client portal (one-off) — PARTIALLY DONE

### L5-01 (INFRA/BE) Supabase Auth magic link — DONE
### L5-02 (BE) GET /api/orders/:id — DONE
### L5-03 (FE) Order detail page — DONE
### L5-04 (FE/BE) Messaging thread — pending
### L5-05 (BE) Signed download links — DONE (stub)

---

## Level 6 — Subscription signup + onboarding (NEW)

### L6-01 (FE) Subscription onboarding page — NEW
- **Scope**: After successful subscription checkout, show onboarding: upload first batch of raw content OR paste shared folder link (Google Drive/Dropbox URL)
- **AC**:
  - User can upload files using existing R2 uploader
  - User can paste a folder URL (validated as URL, stored on subscription)
  - User can do both
  - "Complete onboarding" button transitions to subscription dashboard

### L6-02 (BE) PATCH /api/subscriptions/me — NEW
- **Scope**: Update shared_folder_url on current user's subscription
- **AC**:
  - Only subscription owner can update
  - Validates URL format

### L6-03 (FE) Subscription dashboard — NEW
- **Scope**: Main portal view for subscribers at /dashboard. Shows:
  - Subscription plan and status
  - Content pieces: list with status, type, thumbnail
  - Pieces used / total this month
  - Shared folder link (editable)
  - Link to billing portal
- **AC**:
  - Filterable by piece status (all / pending / delivered / approved)
  - Clear visual indicators for pieces needing action (approve/revise)

### L6-04 (BE) GET /api/subscriptions/me — NEW
- **Scope**: Return current user's subscription with plan details, quota usage, shared folder URL
- **AC**: Only authenticated user can access their own subscription

### L6-05 (BE) GET /api/subscriptions/me/content-pieces — NEW
- **Scope**: List content pieces for the current subscriber, paginated, filterable by status
- **AC**: Returns piece ID, type, status, thumbnail, suggested_caption preview, created_at

---

## Level 7 — Content piece flow (NEW)

### L7-01 (FE) Content piece detail page — NEW
- **Scope**: Page at /dashboard/pieces/:id showing:
  - Raw assets uploaded
  - Delivery preview + download (if delivered)
  - Suggested caption (copyable)
  - Suggested song (name, artist, link)
  - Suggested post date
  - Approve / Request revision / Skip buttons
  - Revision quota indicator
- **AC**:
  - Approve transitions to APPROVED then READY_TO_POST
  - Request revision enforces quota
  - Skip marks as SKIPPED

### L7-02 (BE) POST /api/content-pieces/:id/approve — NEW
- **Scope**: Transition piece to APPROVED/READY_TO_POST
- **AC**: Only piece owner can approve; creates status_history entry

### L7-03 (BE) POST /api/content-pieces/:id/request-revision — NEW
- **Scope**: Transition piece to REVISION_REQUESTED; increment revisions_used; enforce quota
- **AC**: Blocked if quota exceeded; requires revision notes

### L7-04 (BE) POST /api/content-pieces/:id/skip — NEW
- **Scope**: Transition piece to SKIPPED (subscriber decides not to use this piece)
- **AC**: Only piece owner; creates status_history entry

### L7-05 (BE) GET /api/content-pieces/:id — NEW
- **Scope**: Return full piece detail: assets, deliveries, suggestion, status history
- **AC**: Only piece owner or admin can access

---

## Level 8 — Admin dashboard (extended)

### L8-01 (FE) Admin subscribers list — NEW
- **Scope**: Page at /admin/subscribers showing all active subscribers with: email, plan, pieces used/total, shared folder link, subscription status
- **AC**: Filterable by plan, sortable by pieces remaining

### L8-02 (FE/BE) Admin subscriber detail — NEW
- **Scope**: Page at /admin/subscribers/:id showing subscriber info + all their content pieces
- **AC**: Admin can see shared folder link, content queue, billing status

### L8-03 (BE) POST /api/admin/content-pieces — NEW
- **Scope**: Admin creates a new content piece for a subscriber (e.g. after pulling raw content from shared folder)
- **AC**: Sets status to RAW_RECEIVED, links to subscription, increments pieces_used_this_period

### L8-04 (FE/BE) Admin deliver with suggestion — NEW
- **Scope**: When admin delivers a content piece, form includes: file upload + suggested caption + suggested song (name, artist, URL) + suggested post date
- **AC**: Creates delivery record + updates piece with suggestion fields + transitions to DELIVERED

### L8-05 (BE) GET /api/admin/subscribers — NEW
- **Scope**: List all subscribers with plan info and quota usage
- **AC**: Admin-only; paginated

### L8-06 (FE/BE) Admin one-off orders — DONE (existing, kept)
- Orders list with filters + SLA risk
- Order detail + status actions

---

## Level 9 — Notifications + retention

### L9-01 (COPY/BE) Email templates — UPDATED
- **Scope**: Templates for all events:
  - One-off: payment, in-progress, delivered, revision delivered, completed
  - Subscription: welcome, piece in-progress, piece delivered (with suggestion preview), revision delivered, piece approved, renewal reminder, payment failed
- **AC**: Consistent branding, includes portal link

### L9-02 (BE) Notification triggers on status changes — UPDATED
- **Scope**: Centralized status transition helper that triggers emails for both one-off orders and content pieces
- **AC**: Idempotent, no duplicate emails

### L9-03 (OPS/INFRA) Daily retention job — pending (same as v1)

### L9-04 (BE) Subscription renewal piece reset — NEW
- **Scope**: On subscription renewal (Stripe webhook: invoice.paid for subscription_cycle), reset pieces_used_this_period to 0
- **AC**: Only resets on actual renewal, not initial payment

---

## Level 10 — Launch hardening

### L10-01 (OPS) Rate limiting + abuse protection — pending
### L10-02 (OPS) Logging + error tracking — pending
### L10-03 (OPS) Security review checklist — pending

### L10-04 (FE/COPY) Public site launch polish — UPDATED
- **Scope**: All public pages updated with agency positioning, subscription-first pricing, both flows explained
- **AC**: Professional copy, clear CTAs, trust signals, mobile-first

### L10-05 (OPS) Basic metrics instrumentation — pending

### L10-06 (BE) Stripe customer portal integration — NEW
- **Scope**: Integrate Stripe Billing customer portal so subscribers can manage their plan, update payment method, cancel
- **AC**: Link from subscription dashboard opens Stripe-hosted portal

---

## Cross-cutting tickets

### X-01 (BE) Status machine helper + audit logging — UPDATED
- **Scope**: Central function for transitions for BOTH orders and content_pieces; writes status_history and triggers notifications
- **AC**: Disallows invalid transitions for both state machines

### X-02 (FE) Constraints UI components — DONE (needs brand color update)

### X-03 (BE) Price calculation module — UPDATED
- **Scope**: Single source of truth for one-off pricing AND subscription plan details (pieces/month, revisions/piece, price)
- **AC**: Used in UI, checkout creation, and admin dashboard

### X-04 (BE) Content suggestion module — NEW
- **Scope**: Utility for storing and displaying content suggestions (caption + song + post date) on content pieces
- **AC**: Used by admin deliver form and client piece detail page
