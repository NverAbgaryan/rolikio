# PRD (MVP 0→10) — rolik.io (Done-For-You Reels App)
**Document type:** Product Requirements Document (feature + task oriented, Cursor-ready)  
**Product / brand:** **rolik.io**  
**Version:** v1.0 (MVP)  
**Date:** 2026-02-04  

---

## 0) Executive summary

### Vision
Build the easiest app for regular people and small businesses to get **ready-to-post short reels** without learning any editing tools. Users upload footage, add references and a short description (or voice note), pay, then receive a finished reel and can approve or request changes.

### North-star promise (customer-facing)
**Upload clips + references + a short note → get a rolik-ready reel you’re happy to post in 48–72h.**

### What this product is (and is not)
- ✅ **Is:** an order + production + review system (reels-as-a-service)
- ❌ **Not:** a video editor like CapCut (no timeline UI, no advanced editing controls)

### MVP constraints (non-negotiable)
- **Final delivered reel length:** **≤ 120 seconds**
- **Revision limits:** strict (1–2 included depending on tier)
- **Raw footage limits:** strict (per tier) — this controls cost/time
- **No “viral guarantee.”** Only “post-ready aligned to references.”

---

## 1) Goals, non-goals, and success metrics

### 1.1 Goals (MVP)
1. **Ultra-simple purchase flow** (mobile-first, 3 steps).
2. **Reliable upload + payment + order tracking**.
3. **Admin workflow** to manage orders, assign editor, deliver results, and handle revisions.
4. **Controlled revision loop** with quotas and paid extras.
5. **Secure file storage** (private, expiring download links).
6. **Email notifications** on key status changes.
7. **Basic analytics** to measure unit economics and retention.

### 1.2 Non-goals (excluded from MVP)
- AI auto-edit generation (“autopilot”)
- Timeline editor / trimming UI
- Social media scheduling/publishing integrations
- Public marketplace / bidding system for editors
- Advanced analytics dashboards
- Multi-tenant agency features (multiple client workspaces)

### 1.3 Success metrics (MVP works when…)
**Operational**
- Avg total production time per reel (incl. comms) **≤ 60 minutes**
- On-time delivery rate **≥ 90%** vs SLA
- First-pass approval rate **≥ 60%** (target 70% later)

**Business**
- Gross margin after editor cost (before marketing) **≥ 60%**
- Refund/chargeback rate **≤ 2%**
- Repeat purchase within 30 days **≥ 20%** (starter target)

**Product**
- Checkout conversion from “Start order” **≥ 3–5%**
- Upload completion rate **≥ 85%**

---

## 2) Target users & use cases

### 2.1 Personas
1) **Regular person (consumer)** — wants personal reels, minimal typing, likes voice notes  
2) **Small business** — wants consistent weekly content, cares about speed + reliability  
3) **Admin/operator** — manages queue, quality, customer support  
4) **Editor** — edits externally, uploads results

### 2.2 Primary use cases
- Vacation recap reel from phone clips
- Cafe/clinic promo reel from raw videos
- Reel similar to a reference link, using customer footage
- Reel with subtitles and clean text

---

## 3) Product scope & packages (MVP)

### 3.1 Core product: Reels (≤120s final)
**Tiers**
- **Tier A:** 15–30s
- **Tier B:** 30–60s
- **Tier C:** 60–120s

### 3.2 Limits (must be visible in UI)
**Raw footage included (example)**
- Tier A: up to **2 minutes** raw
- Tier B: up to **5 minutes** raw
- Tier C: up to **10 minutes** raw  
Extra raw footage = paid add-on.

**Included revisions**
- Tier A: 1
- Tier B: 1
- Tier C: 2 (or 1 if you want stricter economics)

**SLA**
- Standard: 48–72h (exact rules in Status section)
- Rush add-on (optional): 24h

### 3.3 Add-ons (MVP)
- Subtitles
- Rush delivery
- Extra raw footage
- Extra revision

### 3.4 Music policy (MVP)
Avoid delivering copyrighted music files. Deliver without music or with safe audio, or instruct user to add music in the platform during posting.

---

## 4) End-to-end journeys

### 4.1 Consumer (guest-friendly)
Choose → upload → brief → pay → track status → review delivery → approve/revise → complete.

### 4.2 Small business
Same flow; upsell bundles after first order (V1.1+).

### 4.3 Admin
PAID → IN_REVIEW → IN_PROGRESS → DELIVERED → (REVISION…) → COMPLETED.

---

## 5) Feature requirements (MVP)

### 5.1 Public website (required)
**Pages:** Home, Pricing, How it works, FAQ, Terms, Privacy  
**Must-have:** examples, constraints, SLA, revisions, refund summary.  
**Acceptance:** mobile-first, clear CTA.

**Brand copy placeholders (rolik.io)**
- Headline: “Reels, done for you.”
- Subhead: “Upload your clips, share a reference, and we’ll deliver a post‑ready reel in 48–72h.”
- CTA: “Create my rolik”

---

### 5.2 Order wizard (required)
**Step 1: Choose**
- Platform (IG/TikTok/Shorts)
- Tier (A/B/C)
- Vibe cards (6–8)
- Add-ons toggles (subtitles, rush)

**Step 2: Upload**
- Multiple uploads (video/photo + optional logo)
- Client-side validation: types + max size
- Progress bars + retry
- Show raw duration used vs limit

**Step 3: Brief**
- Required: “What do you want?”
- Optional: “Avoid…”, “Must include…”
- References (up to 5 links)
- Voice note upload (optional but recommended)

**Acceptance:** finish in <2 minutes; cannot submit without payment + ≥1 file + required brief.

---

### 5.3 Payments (required)
- Checkout session creation
- Webhook verification + idempotency
- Transition to PAID + due date

**Acceptance:** no duplicates; failed checkout returns safely.

---

### 5.4 Client portal (required)
**Access:** magic link (recommended) or account login  
**Features:** status timeline, assets/brief, messages, delivery preview+download, approve, request revision, revision quota indicator.

---

### 5.5 Revision loop (required)
**Request changes UI**
- checkboxes (pacing, text, trim, add/remove, other)
- free text + optional timestamp notes
**Rules**
- enforce included revisions
- if exceeded → paid extra revision flow (optional in MVP: manual)

---

### 5.6 Admin dashboard (required)
- Orders list (filters + SLA risk)
- Order detail (assets, brief, notes, status history)
- Assign editor
- Upload delivery (versioning)
- Manage revisions and close order

---

### 5.7 Notifications (required)
Email on: payment, in-progress, delivered, revision delivered, completed.

---

### 5.8 Storage & security (required)
- Presigned uploads
- Signed expiring downloads
- Retention policy: raw 30d after completion, deliveries 90d (suggested)

---

## 6) Status machine (required)

### 6.1 Status enum
`DRAFT` → `AWAITING_PAYMENT` → `PAID` → `IN_REVIEW` → `IN_PROGRESS` → `DELIVERED` → (`REVISION_REQUESTED` → `REVISION_IN_PROGRESS` → `DELIVERED`) → `COMPLETED`  
Admin-only: `CANCELED`, `REFUNDED` (optional)

### 6.2 SLA clock rule
SLA starts only when: payment confirmed + uploads complete + brief exists.  
Compute `due_at` from tier + add-ons.

---

## 7) Data model (MVP)

### 7.1 Tables
**users**(id, email, name?, created_at)

**orders**(
id, user_id?, email,
tier, platform, vibe,
add_ons(json),
status, price_cents, currency,
raw_limit_seconds, raw_used_seconds,
revisions_included, revisions_used,
due_at,
stripe_checkout_session_id, stripe_payment_intent_id,
created_at, updated_at
)

**order_assets**(
id, order_id, kind(video/image/voice/logo),
storage_key, filename, mime_type, size_bytes, duration_seconds?, created_at
)

**order_references**(id, order_id, url, created_at)

**messages**(id, order_id, sender(client/admin/editor), body, created_at)

**deliveries**(id, order_id, version_number, storage_key, filename, duration_seconds, created_at)

**status_history**(id, order_id, from_status, to_status, actor, created_at)

---

## 8) API requirements (MVP)

### 8.1 Client APIs
- `POST /api/orders` (create draft)
- `POST /api/orders/:id/checkout` (create checkout)
- `POST /api/stripe/webhook` (payment update)
- `POST /api/uploads/presign` (get upload URL)
- `POST /api/orders/:id/assets` (register asset metadata)
- `GET /api/orders/:id` (order detail)
- `POST /api/orders/:id/messages`
- `POST /api/orders/:id/approve`
- `POST /api/orders/:id/request-revision`

### 8.2 Admin APIs
- `GET /api/admin/orders`
- `GET /api/admin/orders/:id`
- `POST /api/admin/orders/:id/status`
- `POST /api/admin/orders/:id/assign`
- `POST /api/admin/orders/:id/deliveries`

### 8.3 Auth
- Client: magic link or session cookie
- Admin: email allowlist (MVP)

---

## 9) UX screens list (MVP)

**Public**
1. Home
2. Pricing
3. How it works
4. FAQ
5. Terms/Privacy

**Client**
6. Wizard: Choose
7. Wizard: Upload
8. Wizard: Brief
9. Checkout success/cancel
10. Order detail/status + messages + review

**Admin**
11. Orders list
12. Order detail + actions
13. Upload delivery (modal/page)

---

## 10) MVP build plan (0→10)

### Level 0 — Repo & foundations
**Objective:** project skeleton and tooling.
**Tasks**
- repo structure, env setup, lint/format
- choose stack and configure local dev
**Acceptance:** app boots locally.

### Level 1 — DB & migrations
**Tasks**
- create tables/migrations
- DB client wrapper
**Acceptance:** CRUD in dev.

### Level 2 — Presigned uploads
**Tasks**
- presign endpoint
- client upload helper
- asset registration
**Acceptance:** upload multiple files reliably, private storage.

### Level 3 — Order wizard + DRAFT orders
**Tasks**
- 3-step wizard UI
- `POST /api/orders`
- validate tier rules + raw limits
**Acceptance:** user can create order draft.

### Level 4 — Payments + webhook
**Tasks**
- checkout session endpoint
- webhook verification/idempotency
- status becomes PAID, due_at set
**Acceptance:** payment transitions reliably.

### Level 5 — Client portal + timeline
**Tasks**
- auth (magic link)
- order detail endpoint + UI
- status timeline and messages thread
**Acceptance:** client can track status.

### Level 6 — Admin dashboard
**Tasks**
- admin auth allowlist
- orders list with filters + SLA risk
- order detail + status actions
**Acceptance:** admin can operate queue.

### Level 7 — Deliveries (versioned)
**Tasks**
- admin upload delivery
- signed download URLs
- client preview/download
- email “delivered”
**Acceptance:** client receives reel safely.

### Level 8 — Revisions + enforcement
**Tasks**
- request revision flow (quota enforced)
- admin revision status + upload v2
**Acceptance:** no infinite free revisions.

### Level 9 — Notifications + retention hooks
**Tasks**
- email templates
- “order again” CTA, basic survey (optional)
**Acceptance:** clean comms.

### Level 10 — Launch hardening
**Tasks**
- rate limiting, logging
- retention deletion job
- basic metrics panel
**Acceptance:** stable for paid traffic.

---

## 11) QC checklist (editor/admin)
- 9:16, 1080×1920
- ≤120s
- readable text + safe margins
- clean cuts, no glitches
- captions if paid
- no copyrighted audio delivered
