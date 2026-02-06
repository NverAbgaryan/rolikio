# rolik.io — MVP 0→10 Ticket Backlog (v2.1 — Agency + Subscriptions + Ruul.io)

This file turns the PRD build plan (Levels 0-10) into actionable tickets.

## Conventions
- **Type**: FE (frontend), BE (backend/API), DB (database), INFRA (hosting/storage/secrets), OPS (ops/monitoring), COPY (copy/legal/email)
- **AC** = acceptance criteria
- **Deps** = dependencies
- **Status**: DONE / IN PROGRESS / PENDING / NEW

## Global decisions captured

**Stack:**
- Next.js (Vercel)
- Supabase: Postgres + Auth (magic links)
- Cloudflare R2: raw + delivery file storage
- **Ruul.io** for payments (checkout links, invoicing — replaces Stripe)
- Resend for emails
- Vercel Cron (daily) for retention cleanup

**Payment approach (Ruul.io):**
- Ruul.io uses **checkout links** (not a programmable API like Stripe)
- For one-off orders: admin creates a payment request in Ruul.io, we store the checkout URL on the order, client pays via link
- For subscriptions: admin creates recurring payment request in Ruul.io, we store the link
- Payment confirmation: admin manually marks order/subscription as paid in admin dashboard (MVP), or we poll/check manually
- Future: if Ruul.io adds webhooks/API, automate payment status updates

**Business model:**
- Subscriptions: Starter ($299/mo, 8 pieces) and Growth ($599/mo, 20 pieces)
- One-off: Quick Reel $59, Standard Reel $89, Full Reel $159, Photo Edit packages
- Content types: reels, photos, carousels, stories
- Content suggestions: caption + song recommendation per piece (subscribers)

---

## Level 0 — Repo and foundations — DONE

### L0-01 Initialize Next.js + TS + repo structure — DONE
### L0-02 Environment + secrets strategy — DONE
### L0-03 UI foundation (mobile-first) — DONE
### L0-04 Provider project setup — DONE

---

## Level 1 — DB and migrations

### L1-01 Create v1 schema migrations — DONE
### L1-02 Add editing level + pro quote fields — DONE
### L1-03 Add Stripe events table — DONE
### L1-04 DB access layer — DONE
### L1-05 Add brief fields to orders — DONE
### L1-06 Add content_type field to orders — PENDING
- **Scope**: Add `content_type` (reel/photo/carousel/story) to orders table
- **AC**: Default "reel" for backward compatibility

### L1-07 Add subscriptions table — NEW
- **Scope**: Create `subscriptions` table: id, user_id, email, plan, status, pieces_per_month, pieces_used_this_period, revisions_per_piece, shared_folder_url, ruul_checkout_url, ruul_payment_status, current_period_start, current_period_end, canceled_at, created_at, updated_at
- **AC**: Migration applies, indexes on user_id, status

### L1-08 Add content_pieces table — NEW
- **Scope**: Create `content_pieces` table: id, subscription_id, user_id, email, type, status enum, revisions_included, revisions_used, suggested_caption, suggested_song_name, suggested_song_artist, suggested_song_url, suggested_post_date, due_at, created_at, updated_at
- **AC**: Status enum matches PRD; FK to subscriptions; indexes on subscription_id, status, due_at

### L1-09 Add content_piece_assets + content_piece_deliveries tables — NEW
- **Scope**: Asset and delivery tables for content pieces
- **AC**: Same shape as order_assets/deliveries but FK to content_pieces

### L1-10 Apply all migrations to Supabase — PENDING (BLOCKED: needs DB password)
- **Scope**: Run 0001, 0002, and new migration files against live Supabase DB
- **AC**: All tables exist; API endpoints stop returning "db_not_initialized"

---

## Level 2 — Presigned uploads — DONE

### L2-01 R2 bucket + CORS — DONE
### L2-02 POST /api/uploads/presign — DONE
### L2-03 Upload component with progress — DONE
### L2-04 POST /api/orders/:id/assets — DONE
### L2-05 Raw duration limit UX — DONE

---

## Level 3 — Order wizard — DONE

### L3-01 Step 1 Choose screen — DONE
### L3-02 POST /api/orders — DONE
### L3-03 Step 2 Upload screen — DONE
### L3-04 Step 3 Brief screen — DONE
### L3-05 Save brief + references — DONE
### L3-06 Pro flow: request quote — DONE

---

## Level 4 — Payments (Ruul.io)

### L4-01 (DB) Add payment fields to orders — NEW
- **Scope**: Add `ruul_checkout_url`, `payment_status` (unpaid/pending/paid/failed), `paid_at` to orders
- **AC**: Fields nullable, default payment_status = "unpaid"

### L4-02 (BE) POST /api/orders/:id/payment-link — NEW
- **Scope**: Admin sets ruul_checkout_url on an order (after creating the payment request in Ruul.io dashboard). Transitions status from DRAFT/AWAITING_PAYMENT to AWAITING_PAYMENT with checkout link attached.
- **AC**: Only admin can set; validates URL format; stores on order

### L4-03 (FE) Order review step: show payment link — NEW
- **Scope**: After order wizard, show "Pay now" button that opens the Ruul.io checkout URL in a new tab. If no link yet, show "We'll send you a payment link shortly."
- **AC**: Button opens ruul checkout URL; disabled if no URL set

### L4-04 (BE) POST /api/admin/orders/:id/mark-paid — NEW
- **Scope**: Admin marks an order as paid (after confirming payment in Ruul.io dashboard). Transitions to PAID, sets paid_at, computes due_at.
- **AC**: Only admin; writes status_history; sets due_at based on tier/add-ons

### L4-05 (FE) Client order page: payment status — NEW
- **Scope**: Order detail page shows payment status. If unpaid + has checkout URL, show "Pay now" button. If paid, show confirmation.
- **AC**: Clear status indicator (unpaid/pending/paid)

### L4-06 (BE) SLA due_at calculation — PENDING (update from stub)
- **Scope**: When order marked paid, compute due_at from tier + rush add-on
- **AC**: Standard = +72h; Rush = +24h

---

## Level 5 — Complete one-off order flow

### L5-01 Supabase Auth magic link — DONE
### L5-02 GET /api/orders/:id — DONE
### L5-03 Order detail page — DONE

### L5-04 (BE) POST /api/orders/:id/approve — NEW
- **Scope**: Client approves delivery; transitions to COMPLETED
- **AC**: Only order owner; requires at least 1 delivery; writes status_history

### L5-05 (BE) POST /api/orders/:id/request-revision — NEW
- **Scope**: Client requests revision; enforces quota; transitions to REVISION_REQUESTED
- **AC**: Blocked if revisions_used >= revisions_included; requires revision notes; increments revisions_used

### L5-06 (BE) POST /api/orders/:id/messages — NEW
- **Scope**: Client or admin posts a message on an order
- **AC**: Stores sender type (client/admin); returns created message

### L5-07 (FE) Order detail: actions + messaging — NEW
- **Scope**: Update order detail page with: approve button, request revision form (checkboxes + free text), messages thread, delivery preview/download
- **AC**: All actions call correct APIs; messages display in chronological order; delivery has signed download link

### L5-08 (BE) Signed download URLs for deliveries — NEW
- **Scope**: Generate signed R2 GET URLs for delivery files
- **AC**: URLs expire in 1 hour; only order owner or admin can request

---

## Level 6 — Admin dashboard (one-off orders)

### L6-01 (BE) Admin auth middleware — NEW
- **Scope**: Protect /admin routes and /api/admin/* by checking user email against allowlist (env var or DB)
- **AC**: Non-admin users get 403; allowlist configurable

### L6-02 (FE) Admin layout + navigation — NEW
- **Scope**: /admin layout with sidebar: Orders, Subscribers (future), Settings
- **AC**: Protected by admin auth; clean navigation

### L6-03 (FE/BE) Admin orders list — NEW
- **Scope**: GET /api/admin/orders + page at /admin/orders. Shows all orders with: email, tier, status, payment status, due_at, SLA risk indicator
- **AC**: Filterable by status; sortable by created_at/due_at; SLA risk = overdue or due within 12h

### L6-04 (FE/BE) Admin order detail — NEW
- **Scope**: /admin/orders/:id showing full order: assets, brief, references, messages, deliveries, status history. Actions: change status, assign editor, set payment link, mark paid, upload delivery
- **AC**: All actions update DB and create status_history entries

### L6-05 (BE) POST /api/admin/orders/:id/status — NEW
- **Scope**: Admin changes order status (IN_REVIEW, IN_PROGRESS, etc.)
- **AC**: Validates allowed transitions; writes status_history

### L6-06 (BE) POST /api/admin/orders/:id/deliveries — NEW
- **Scope**: Admin uploads a delivery file (presigned R2 upload + register delivery with version_number)
- **AC**: Increments version; transitions to DELIVERED

### L6-07 (FE) Admin upload delivery form — NEW
- **Scope**: Modal/page for admin to upload delivery file for an order
- **AC**: Uses existing R2 presign flow; shows upload progress

---

## Level 7 — Subscription system

### L7-01 (FE) Subscription signup page — NEW (update existing /subscribe stub)
- **Scope**: Replace "coming soon" with real plan comparison + "Subscribe" buttons that link to Ruul.io checkout (admin pre-creates recurring payment links in Ruul.io)
- **AC**: Each plan has a configurable Ruul.io checkout URL (stored in env or DB)

### L7-02 (BE) POST /api/admin/subscriptions — NEW
- **Scope**: Admin creates a subscription record after confirming Ruul.io payment. Sets plan, pieces_per_month, revisions_per_piece, period dates.
- **AC**: Creates subscription row; links to user by email

### L7-03 (BE) POST /api/admin/subscriptions/:id/activate — NEW
- **Scope**: Admin activates subscription (after Ruul payment confirmed)
- **AC**: Sets status to active; sets current_period_start/end

### L7-04 (FE) Subscription onboarding — NEW
- **Scope**: After subscription activated, show onboarding: upload raw content or paste shared folder link
- **AC**: User can upload files via R2 or paste folder URL; stored on subscription

### L7-05 (BE) GET /api/subscriptions/me — NEW
- **Scope**: Return current user's active subscription with plan details, quota usage, shared folder URL
- **AC**: Only authenticated user's own subscription

### L7-06 (BE) PATCH /api/subscriptions/me — NEW
- **Scope**: Update shared_folder_url
- **AC**: Only subscription owner; validates URL

### L7-07 (FE) Subscription dashboard (/dashboard) — NEW
- **Scope**: Main subscriber portal: plan info, pieces used/remaining, content pieces list, shared folder link, billing info
- **AC**: Filterable by piece status; shows pieces needing action

### L7-08 (BE) GET /api/subscriptions/me/content-pieces — NEW
- **Scope**: List content pieces for current subscriber, paginated, filterable by status
- **AC**: Returns piece summary (id, type, status, thumbnail, suggested_caption preview)

---

## Level 8 — Content piece flow

### L8-01 (BE) POST /api/admin/content-pieces — NEW
- **Scope**: Admin creates a content piece for a subscriber (after pulling raw content from shared folder)
- **AC**: Sets status RAW_RECEIVED; links to subscription; increments pieces_used_this_period; validates quota

### L8-02 (BE) POST /api/admin/content-pieces/:id/deliver — NEW
- **Scope**: Admin uploads delivery + enters suggested caption + song (name, artist, URL) + post date
- **AC**: Creates delivery record; updates suggestion fields; transitions to DELIVERED

### L8-03 (FE) Admin content piece deliver form — NEW
- **Scope**: Form with: file upload, caption textarea, song name/artist/URL inputs, suggested post date
- **AC**: Validates required fields; uploads to R2; calls deliver API

### L8-04 (BE) GET /api/content-pieces/:id — NEW
- **Scope**: Full piece detail: assets, deliveries, suggestions, status history
- **AC**: Only piece owner or admin

### L8-05 (FE) Content piece detail page (/dashboard/pieces/:id) — NEW
- **Scope**: View delivery, suggestion (caption + song with copy button), approve/revise/skip
- **AC**: Approve -> APPROVED -> READY_TO_POST; revision enforces quota; skip -> SKIPPED

### L8-06 (BE) POST /api/content-pieces/:id/approve — NEW
- **AC**: Only piece owner; writes status_history

### L8-07 (BE) POST /api/content-pieces/:id/request-revision — NEW
- **AC**: Enforces quota; requires notes; increments revisions_used

### L8-08 (BE) POST /api/content-pieces/:id/skip — NEW
- **AC**: Only piece owner; writes status_history

---

## Level 9 — Admin subscriber management

### L9-01 (BE) GET /api/admin/subscribers — NEW
- **Scope**: List all subscribers with plan info, quota usage, status
- **AC**: Admin-only; paginated

### L9-02 (FE) Admin subscribers list (/admin/subscribers) — NEW
- **Scope**: Table of subscribers: email, plan, pieces used/total, shared folder, status
- **AC**: Filterable by plan/status

### L9-03 (FE/BE) Admin subscriber detail (/admin/subscribers/:id) — NEW
- **Scope**: Subscriber info + all content pieces + shared folder link + billing notes
- **AC**: Admin can create new content pieces from this page

### L9-04 (BE) POST /api/admin/content-pieces/:id/status — NEW
- **Scope**: Admin changes content piece status
- **AC**: Validates transitions; writes status_history

---

## Level 10 — Notifications

### L10-01 (INFRA) Resend integration — PENDING
- **Scope**: Connect Resend API, create base email template
- **AC**: Can send emails programmatically

### L10-02 (BE) Email templates — PENDING
- **Scope**: Templates for: order confirmation, payment link sent, order delivered, revision delivered, order completed, subscription welcome, piece delivered (with suggestion), piece approved, payment reminder
- **AC**: Consistent branding; includes portal links

### L10-03 (BE) Notification triggers — PENDING
- **Scope**: Send emails on status transitions for both orders and content pieces
- **AC**: Idempotent; no duplicate emails

---

## Level 11 — Launch hardening

### L11-01 (OPS) Rate limiting — PENDING
### L11-02 (OPS) Error tracking (Sentry) — PENDING
### L11-03 (OPS) Security review — PENDING
### L11-04 (OPS) Retention cron job — PENDING
### L11-05 (OPS) Basic metrics — PENDING

---

## Cross-cutting

### X-01 (BE) Status machine helper + audit logging — PENDING
- **Scope**: Central transition function for orders AND content_pieces; writes status_history; triggers notifications
- **AC**: Disallows invalid transitions for both state machines

### X-02 (BE) Price calculation module — PENDING
- **Scope**: Single source of truth for pricing (one-off tiers + subscription plans)

### X-03 (BE) Content suggestion module — NEW
- **Scope**: Utility for storing/displaying caption + song + post date on content pieces
