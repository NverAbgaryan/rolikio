# PRD (MVP 0→10) — rolik.io (Content Editing Agency)
**Document type:** Product Requirements Document (feature + task oriented, Cursor-ready)  
**Product / brand:** **rolik.io**  
**Version:** v2.0 (Pivot to Agency + Subscriptions)  
**Date:** 2026-02-06  

---

## 0) Executive summary

### Vision
Build the go-to platform for regular people and small businesses who want **professional content editing without learning any tools or managing freelancers**. Clients hand us their raw footage and photos; we edit reels, photos, carousels, and stories — and suggest what to post, when, and with which song.

### North-star promise (customer-facing)
**We edit your content so you don't have to. Professional reels and photo editing — on demand or on subscription.**

### What this product is (and is not)
- **Is:** a content editing agency platform (reels + photo editing, subscriptions + one-off orders, content suggestions with song recommendations)
- **Not:** a video editor like CapCut (no timeline UI), not a social media scheduler (we suggest, you post), not an AI auto-editor

### Two revenue streams
1. **Subscriptions** (primary): monthly plans where we proactively manage a client's content pipeline — review raw material, edit, suggest posts with songs
2. **One-off orders** (secondary): single reel or photo edit for people who need just one piece

### MVP constraints (non-negotiable)
- **Final delivered reel length:** ≤ 120 seconds
- **Revision limits:** strict (per piece, per plan tier)
- **Raw footage limits:** strict (per order tier or subscription allowance)
- **No "viral guarantee."** Only "post-ready, professional, aligned to your brand."
- **Music:** we suggest songs but deliver without copyrighted audio files; client adds audio when posting

---

## 1) Goals, non-goals, and success metrics

### 1.1 Goals (MVP)
1. **Subscription-first model** — make it dead simple for a business to subscribe and start getting content edited weekly.
2. **One-off orders** still available for non-subscribers or one-time needs.
3. **Content suggestion flow** — for subscribers, we don't just edit; we suggest what to post and with which song.
4. **Dual content input** — clients can upload in the app OR share a Google Drive/Dropbox folder link.
5. **Reliable upload + payment + order tracking** for both flows.
6. **Admin workflow** to manage subscription clients, content queues, one-off orders, and deliveries.
7. **Controlled revision loop** with quotas per piece.
8. **Secure file storage** (private, expiring download links).
9. **Email notifications** on key status changes.

### 1.2 Non-goals (excluded from MVP)
- AI auto-edit generation
- Timeline editor / trimming UI
- Actual social media scheduling/publishing (we suggest, client posts)
- Public marketplace / bidding system for editors
- Advanced analytics dashboards
- White-label / multi-agency features

### 1.3 Success metrics (MVP works when...)

**Subscription**
- Monthly Recurring Revenue (MRR) growing week-over-week
- Subscriber churn rate ≤ 10% monthly
- Content pieces delivered per subscriber per month meets plan quota (8 or 20)
- Avg time from raw content received to suggestion delivered ≤ 48h

**One-off orders**
- Avg total production time per piece ≤ 60 minutes
- On-time delivery rate ≥ 90% vs SLA
- First-pass approval rate ≥ 60% (target 70% later)

**Business**
- Gross margin after editor cost ≥ 60%
- Refund/chargeback rate ≤ 2%

**Product**
- Subscription signup conversion from pricing page ≥ 2-3%
- One-off checkout conversion ≥ 3-5%
- Upload completion rate ≥ 85%

---

## 2) Target users & use cases

### 2.1 Personas
1. **Small business owner (subscriber)** — cafe, clinic, salon, gym, restaurant. Wants consistent weekly/daily content without thinking about it. Shares a folder of phone photos/videos and gets back edited posts + reels with song suggestions.
2. **Creator / influencer (subscriber or one-off)** — wants polished content regularly or occasionally. Cares about style consistency.
3. **Regular person (one-off)** — wants a vacation recap reel or event highlight. Doesn't need a subscription.
4. **Admin/operator** — manages content queue across subscribers and one-off orders, assigns editors, ensures quality.
5. **Editor** — edits externally, uploads results, adds song suggestions.

### 2.2 Primary use cases
**Subscription:**
- Cafe owner uploads 20 phone photos/videos per week to shared folder → gets 5 edited reels + posts back with captions and song suggestions → approves and posts
- Salon shares Before/After photos → gets styled carousel posts and story templates
- Gym shares workout clips → gets motivational reels with trending audio suggestions

**One-off:**
- Vacation recap reel from phone clips
- Restaurant promo reel from raw videos
- Event highlight reel
- Product launch reel
- Photo editing for a specific post or carousel

---

## 3) Product scope & packages (MVP)

### 3.1 Subscription plans

**Starter — $299/month**
- 8 content pieces/month (mix of reels + photo edits)
- 1 revision per piece
- Content suggestions with song recommendations
- Suggested posting schedule
- 48-72h turnaround per piece
- Upload in app or shared folder link (Google Drive / Dropbox)

**Growth — $599/month**
- 20 content pieces/month (mix of reels + photo edits)
- 2 revisions per piece
- Priority turnaround (24-48h per piece)
- Weekly content calendar with suggestions
- Dedicated editor (style consistency)
- Upload in app or shared folder link

### 3.2 One-off orders (reels)

**Quick Reel** — $59
- 15-30s final, up to 2 min raw footage, 1 revision, 48-72h delivery

**Standard Reel** — $89
- 30-60s final, up to 5 min raw footage, 1 revision, 48-72h delivery

**Full Reel** — $159
- 60-120s final, up to 10 min raw footage, 2 revisions, 48-72h delivery

### 3.3 One-off orders (photo editing — NEW)
- **Single photo edit** — $15 (color correction, retouching, text overlay)
- **Carousel pack (5 photos)** — $49
- **Story pack (3 stories)** — $29

### 3.4 Add-ons (all flows)
- Subtitles / captions
- Rush delivery (24h)
- Extra raw footage allowance
- Extra revision
- Song suggestion (included in subscription; add-on for one-off)

### 3.5 Music / song policy
We suggest songs for every reel (trending audio, genre-appropriate, royalty-free options). We deliver without copyrighted audio files. Client adds the suggested song in the platform when posting.

### 3.6 Editing levels (kept from v1)
- **Basic**: standard editing (clean cuts, pacing, text, color)
- **Enhanced**: more polish (transitions, motion text, styled overlays)
- **Pro/Complex**: heavy effects, motion graphics → quote-only

---

## 4) End-to-end journeys

### 4.1 Subscription client journey
1. Visit site → see subscription plans → choose Starter or Growth
2. Sign up (email/magic link) → Stripe subscription checkout
3. Onboard: upload raw content in app OR provide shared folder link (Google Drive / Dropbox URL)
4. Agency reviews raw material → selects best clips/photos → edits
5. Agency delivers: finished file + suggested caption + suggested song
6. Client reviews in portal → approves, requests revision, or skips
7. Approved content marked "ready to post" with posting suggestion
8. Cycle repeats (weekly/ongoing)

### 4.2 One-off order journey (kept from v1)
Choose → Upload → Brief → Pay → Track → Review → Approve/Revise → Complete

### 4.3 Admin journey
- View subscription clients dashboard (content queues, delivery schedule)
- View one-off orders queue (SLA risk, status)
- For each content piece: review raw material → assign editor → deliver → handle revisions
- Manage subscription billing status

---

## 5) Feature requirements (MVP)

### 5.1 Public website (required)
**Pages:** Home, Pricing, How it works, FAQ, Terms, Privacy
**Must-have:**
- Agency positioning ("we edit your content")
- Subscription plans prominently displayed
- One-off orders as secondary option
- Examples / before-after
- Trust signals (turnaround, revisions, security)
- Clear CTAs for both subscription and one-off

**Brand copy:**
- Headline: "We edit your content so you don't have to."
- Subhead: "Professional reels and photo editing. Subscribe for ongoing content or order one-off."
- Primary CTA: "Start your subscription"
- Secondary CTA: "Order a single reel"

### 5.2 Subscription signup flow (NEW — required)
- Choose plan (Starter / Growth)
- Create account (email + magic link)
- Stripe subscription checkout (recurring billing)
- Onboarding: upload first batch of raw content OR paste shared folder link
- See subscription dashboard

### 5.3 Client portal — subscription view (NEW — required)
**Features:**
- Subscription status and billing info
- Content pieces: queue of pending / in-progress / delivered / approved items
- Each piece shows: thumbnail, type (reel/photo/carousel/story), status, suggested caption, suggested song, download link
- Approve / request revision / skip per piece
- Upload new raw content or update shared folder link
- Revision quota indicator per piece

### 5.4 Order wizard — one-off (kept, updated)
**Step 1: Choose**
- Content type: Reel or Photo Edit
- If Reel: platform, length tier, vibe, editing level, add-ons
- If Photo: package (single/carousel/story), style, add-ons

**Step 2: Upload**
- Multiple uploads (video/photo + optional logo)
- Progress bars + retry
- Show limits

**Step 3: Brief**
- Required: "What do you want?"
- Optional: "Avoid...", "Must include..."
- References (up to 5 links)
- Voice note (optional)

### 5.5 Payments (required)
- **Subscriptions:** Stripe Billing (recurring) + customer portal for plan management
- **One-off:** Stripe Checkout (one-time) + webhook verification + idempotency

### 5.6 Content suggestion system (NEW — required for subscribers)
For each content piece delivered to a subscriber:
- Suggested caption text
- Suggested song (name + artist + platform link if available)
- Suggested posting day/time (optional in MVP)

### 5.7 Shared folder integration (NEW — required)
- Client can paste a Google Drive or Dropbox shared folder URL
- Admin/editor accesses the folder to pull raw content
- MVP: just store the link; no API integration needed (manual pull by editor)
- Future: auto-sync new files from shared folder

### 5.8 Admin dashboard (required, extended)
- **Subscriber management:** list of active subscribers, plan tier, content quota used/remaining, shared folder link, billing status
- **Content queue:** all content pieces across subscribers (filterable by client, status, due date)
- **One-off orders:** kept from v1 (filters + SLA risk)
- **Per-piece actions:** assign editor, upload delivery, add suggestion (caption + song), manage revisions, close piece
- **Delivery with suggestion:** when uploading a finished piece, admin also enters suggested caption + suggested song

### 5.9 Revision loop (required, same as v1)
- Checkboxes + free text + timestamp notes
- Enforce revision quota per piece
- Exceeded → paid extra revision

### 5.10 Notifications (required)
Email on: subscription started, piece in-progress, piece delivered (with suggestion), revision delivered, piece approved, subscription renewal, payment failed.

### 5.11 Storage & security (required, same as v1)
- Presigned uploads to R2
- Signed expiring downloads
- Retention: raw 30d after completion, deliveries 90d

---

## 6) Status machines

### 6.1 One-off order status (kept from v1)
`DRAFT` → `AWAITING_PAYMENT` → `PAID` → `IN_REVIEW` → `IN_PROGRESS` → `DELIVERED` → (`REVISION_REQUESTED` → `REVISION_IN_PROGRESS` → `DELIVERED`) → `COMPLETED`
Admin-only: `CANCELED`, `REFUNDED`

### 6.2 Subscription content piece status (NEW)
`RAW_RECEIVED` → `IN_REVIEW` → `IN_PROGRESS` → `DELIVERED` → (`REVISION_REQUESTED` → `REVISION_IN_PROGRESS` → `DELIVERED`) → `APPROVED` → `READY_TO_POST`
Admin-only: `SKIPPED`

### 6.3 Subscription status
`ACTIVE` → `PAST_DUE` → `CANCELED`
`ACTIVE` → `CANCELED`

---

## 7) Data model (MVP)

### 7.1 Existing tables (kept, minor updates)
**users**(id, email, name?, created_at)

**orders** (one-off only)
(id, user_id?, email, content_type, tier, platform, vibe, editing_level, add_ons, status, price_cents, currency, raw_limit_seconds, raw_used_seconds, revisions_included, revisions_used, due_at, brief_want, brief_avoid, brief_must_include, stripe_checkout_session_id, stripe_payment_intent_id, quote_requested_at, quoted_price_cents, quoted_due_at, quoted_at, created_at, updated_at)

**order_assets** (kept)
**order_references** (kept)
**messages** (kept, also used for content_pieces)
**deliveries** (kept, also used for content_pieces)
**status_history** (kept, also used for content_pieces)
**stripe_events** (kept)

### 7.2 New tables

**subscriptions**(
id, user_id, email,
plan(starter|growth),
status(active|past_due|canceled),
pieces_per_month, pieces_used_this_period,
revisions_per_piece,
shared_folder_url?,
stripe_subscription_id, stripe_customer_id,
current_period_start, current_period_end,
canceled_at?,
created_at, updated_at
)

**content_pieces**(
id, subscription_id, user_id, email,
type(reel|photo|carousel|story),
status(raw_received|in_review|in_progress|delivered|revision_requested|revision_in_progress|approved|ready_to_post|skipped),
revisions_included, revisions_used,
suggested_caption?,
suggested_song_name?,
suggested_song_artist?,
suggested_song_url?,
suggested_post_date?,
due_at?,
created_at, updated_at
)

**content_piece_assets**(
id, content_piece_id, kind(video|image|voice|logo|raw),
storage_key, filename, mime_type, size_bytes, duration_seconds?,
created_at
)

**content_piece_deliveries**(
id, content_piece_id, version_number,
storage_key, filename, duration_seconds?,
created_at
)

---

## 8) API requirements (MVP)

### 8.1 Subscription APIs (NEW)
- `POST /api/subscriptions/checkout` (create Stripe subscription checkout)
- `POST /api/stripe/webhook` (handle subscription events: created, updated, canceled, payment_failed)
- `GET /api/subscriptions/me` (current user's subscription)
- `PATCH /api/subscriptions/me` (update shared folder URL)
- `GET /api/subscriptions/me/content-pieces` (list content pieces)
- `GET /api/content-pieces/:id` (piece detail + suggestion + delivery)
- `POST /api/content-pieces/:id/approve`
- `POST /api/content-pieces/:id/request-revision`
- `POST /api/content-pieces/:id/skip`

### 8.2 One-off order APIs (kept from v1)
- `POST /api/orders` (create draft)
- `POST /api/orders/:id/checkout`
- `POST /api/uploads/presign`
- `POST /api/orders/:id/assets`
- `POST /api/orders/:id/brief`
- `GET /api/orders/:id`
- `POST /api/orders/:id/messages`
- `POST /api/orders/:id/approve`
- `POST /api/orders/:id/request-revision`

### 8.3 Admin APIs (extended)
- `GET /api/admin/subscribers` (list active subscribers)
- `GET /api/admin/subscribers/:id` (subscriber detail + content pieces)
- `POST /api/admin/content-pieces` (create new piece from raw content)
- `POST /api/admin/content-pieces/:id/deliver` (upload delivery + suggestion)
- `POST /api/admin/content-pieces/:id/status` (change status)
- (One-off admin APIs kept from v1)

### 8.4 Auth (same as v1)
- Client: magic link or session cookie
- Admin: email allowlist

---

## 9) UX screens list (MVP)

**Public**
1. Home (agency positioning, subscription-first)
2. Pricing (subscriptions + one-off)
3. How it works (both flows)
4. FAQ
5. Terms / Privacy

**Client — Subscription**
6. Subscription checkout
7. Onboarding (upload raw content or paste folder link)
8. Subscription dashboard (pieces queue, billing)
9. Content piece detail (preview, suggestion, approve/revise)

**Client — One-off**
10. Order wizard: Choose (reel or photo)
11. Order wizard: Upload
12. Order wizard: Brief
13. Checkout success/cancel
14. Order detail/status + messages + review

**Admin**
15. Subscribers list
16. Subscriber detail + content queue
17. Content piece detail + deliver with suggestion
18. One-off orders list
19. One-off order detail + actions

---

## 10) MVP build plan (0→10)

### Level 0 — Repo & foundations (DONE)
Project skeleton, tooling, env setup, local dev.

### Level 1 — DB & migrations (PARTIALLY DONE)
- Existing tables: orders, order_assets, etc.
- NEW: add subscriptions, content_pieces, content_piece_assets, content_piece_deliveries tables

### Level 2 — Presigned uploads (DONE)
R2 presign + client upload + asset registration.

### Level 3 — One-off order wizard (DONE)
3-step wizard + POST /api/orders + validation.

### Level 4 — Payments: one-off + subscription (PARTIALLY DONE)
- One-off: Stripe Checkout + webhook (existing)
- NEW: Stripe Billing subscription checkout + webhook for subscription events

### Level 5 — Client portal: one-off (PARTIALLY DONE)
Auth + order detail + status timeline.

### Level 6 — Subscription signup + onboarding (NEW)
- Subscription checkout flow (Stripe Billing)
- Onboarding: upload raw content or paste shared folder link
- Subscription dashboard (content pieces list, billing status)

### Level 7 — Content piece flow (NEW)
- Admin creates content pieces from raw material
- Admin delivers with suggestion (caption + song)
- Client reviews, approves, requests revision, or skips
- Revision enforcement

### Level 8 — Admin dashboard (extended)
- Subscribers list + detail
- Content queue across subscribers
- One-off orders (existing)
- Deliver with suggestion form

### Level 9 — Notifications + retention
- Email templates for subscription events + content piece events
- Retention deletion jobs

### Level 10 — Launch hardening
- Rate limiting, logging
- Metrics instrumentation
- Stripe subscription portal integration

---

## 11) QC checklist (editor/admin)

**Reels:**
- 9:16, 1080x1920
- ≤120s
- Readable text + safe margins
- Clean cuts, no glitches
- Captions if included
- Song suggestion added (name + artist + link)
- No copyrighted audio delivered in file

**Photos:**
- Correct aspect ratio for target platform
- Color-corrected and retouched
- Text overlays clean and readable
- Brand-consistent style
- Suggested caption added
