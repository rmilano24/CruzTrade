# Cruz Trade — Project Brief

Cruz Trade is a hyperlocal skill trade and tool rental marketplace for Santa Cruz County, CA.
Neighbors can hire each other for services, rent tools and equipment, or trade skills directly
(barter). Bilingual English/Spanish from day one.

---

## Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| Frontend | SvelteKit | Ryan's existing framework |
| Styling | Tailwind CSS v3 | Custom tokens in tailwind.config.js |
| Auth | Supabase Auth | Email + social login |
| Database | Supabase (PostgreSQL) | pgvector enabled for AI matching |
| File Storage | Supabase Storage | Public bucket for listing images, private for sensitive |
| Payments | Stripe Connect | Marketplace split payments, 5–8% platform fee |
| Real-time | Supabase Realtime | Live messaging via messages table subscription |
| Maps | Mapbox or Google Maps | Neighborhood-level filtering within SC County |
| i18n | paraglide-js or svelte-i18n | EN + ES, wire in before building any UI components |
| AI matching | Claude API + pgvector | Semantic search for trade matching (Phase 2) |

---

## Design System

All tokens are in `tailwind.config.js`. Use Tailwind classes exclusively — no inline styles.

### Colors
- `bg-primary` / `text-primary-fg` — orange `#f97316`, used for CTAs and active states
- `bg-bg` — page background white
- `bg-bg-card` — card/panel background `#f5f5f5`
- `bg-bg-secondary` — input background `#f0f0f0`
- `border-border` — all borders `#e0e0e0`
- `text-text-primary` — body text `#111111`
- `text-text-muted` — secondary text `#666666`

### Typography
- Font: Inter (loaded via `@fontsource/inter` or Google Fonts)
- Scale: `text-xs` (11px) → `text-2xl` (32px) — see tailwind.config.js for full scale

### Key component patterns
- **Primary button**: `bg-primary text-white font-semibold px-5 py-2.5 rounded-md hover:bg-primary-hover`
- **Ghost button**: `border border-border text-text-primary font-semibold px-5 py-2.5 rounded-md`
- **Card**: `bg-bg-card border border-border rounded-lg p-4 shadow-card`
- **Input**: `bg-bg-secondary border border-border rounded-md px-3.5 py-2.5 text-base focus:border-primary focus:outline-none`
- **Badge/pill**: `bg-bg-secondary text-text-muted text-xs px-2.5 py-1 rounded-full`
- **Nav**: height 64px, white bg, bottom border, logo left + actions right

---

## Database Schema

All tables use Supabase PostgreSQL. Enable RLS on every table from day one.

### profiles (extends Supabase auth.users)
```sql
id uuid PK (matches auth.users id)
username text unique
full_name text
avatar_url text
bio text
neighborhood text
region text default 'santa-cruz'
language_preference text  -- 'en' or 'es'
is_verified boolean default false
stripe_account_id text
created_at timestamptz
updated_at timestamptz
```

### listings
```sql
id uuid PK
user_id uuid FK -> profiles
type text  -- 'service' | 'tool_rental'
title text
description text
category text  -- 'home_garden' | 'tech' | 'tools' | 'wellness' | 'creative' | 'transport'
price integer  -- cents (5000 = $50.00)
price_unit text  -- 'flat' | 'per_hour' | 'per_day'
accepts_trade boolean default false
trade_description text
neighborhood text
region text default 'santa-cruz'
language text  -- 'en' | 'es' | 'both'
is_active boolean default true
embedding vector(1536)  -- for AI semantic search (pgvector)
created_at timestamptz
updated_at timestamptz
```

### transactions
```sql
id uuid PK
listing_id uuid FK -> listings
buyer_id uuid FK -> profiles
seller_id uuid FK -> profiles
type text  -- 'payment' | 'trade'
amount integer  -- cents
platform_fee integer  -- cents
stripe_payment_intent_id text
deposit_amount integer  -- cents, tool rentals only
deposit_status text  -- 'none' | 'held' | 'released' | 'forfeited'
status text  -- 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'disputed'
scheduled_date date
created_at timestamptz
updated_at timestamptz
```

### reviews
```sql
id uuid PK
transaction_id uuid FK -> transactions
reviewer_id uuid FK -> profiles
reviewee_id uuid FK -> profiles
rating integer  -- 1-5
body text
created_at timestamptz
```

### messages
```sql
id uuid PK
thread_id uuid
sender_id uuid FK -> profiles
recipient_id uuid FK -> profiles
listing_id uuid FK -> listings (nullable)
transaction_id uuid FK -> transactions (nullable)
body text
is_read boolean default false
created_at timestamptz
```

### regions
```sql
id text PK  -- 'santa-cruz'
display_name text  -- 'Santa Cruz County'
display_name_es text  -- 'Condado de Santa Cruz'
is_active boolean
created_at timestamptz
```

### RLS rules (critical)
- Listings: publicly readable when `is_active = true`
- Profiles: publicly readable; only owner can update
- Messages: only sender/recipient can read
- Transactions: only buyer/seller can read full details
- Reviews: publicly readable

---

## Screen Inventory (MVP)

All 11 screens are wireframed in Paper.design ("Jolly petal" file).
Build in this order — it matches the user journey:

1. **Landing** — hero, tagline, CTA to browse or post, how it works, featured listings
2. **Browse Listings** — filter by category/type/neighborhood, listing card grid
3. **Listing Detail** — images, description, provider sidebar, Hire / Propose Trade / Message CTAs
4. **Book / Hire** — job description, date, hours, neighborhood, payment method, order summary
5. **Booking Confirmation** — success state, booking receipt, Stripe escrow notice
6. **Sign Up** — email + password, or social auth
7. **Log In** — email + password, forgot password link
8. **Onboarding** — 3-step: profile info → neighborhood → first listing prompt
9. **Post a Service** — listing form: type, title, description, category, price, trade toggle
10. **Provider Profile** — public profile, listings, reviews, contact CTA
11. **Messages** — thread list + conversation view

---

## Product Decisions (already made — do not re-litigate)

- **Payments**: Stripe Connect only. No Venmo/Zelle — they have no split-payment API for marketplaces.
- **Platform fee**: 5–8% taken at transaction time via Stripe Connect.
- **Tool rental deposits**: Held via Stripe, released/forfeited after return confirmed.
- **Bilingual**: EN + ES co-equal. Wire i18n in before building any component. Use `paraglide-js` preferred.
- **Region column**: Add `region = 'santa-cruz'` default to profiles and listings from day one for future multi-region support.
- **Trade/barter**: Fully supported — `accepts_trade` + `trade_description` on listings; `type = 'trade'` on transactions (amount = 0).
- **Font**: Inter. Locked in.
- **AI matching**: pgvector embeddings on listings table — add the column now even if the feature ships later.

---

## MVP Scope (Phase 1)

Build these, nothing else:

- Auth (sign up, log in, onboarding)
- Browse listings with category + neighborhood filter
- Post a listing (service or tool rental)
- Listing detail with booking flow
- Stripe Connect payments + deposit holds for tool rentals
- In-app messaging (Supabase Realtime)
- Reviews after completed transactions
- Basic provider profile page
- EN + ES language toggle

### Explicitly out of MVP
- Mobile app / PWA
- AI semantic matching (add pgvector column, ship feature in Phase 2)
- Pro Profile / SEO mini-website (Phase 2)
- Verification / ID check
- Demand-side notifications / digest email (manual until Phase 2)

---

## i18n Setup

Wire this in before writing a single UI string.

```bash
npm install @inlang/paraglide-js
```

All user-facing strings go through the i18n system — never hardcode English text directly in components. Spanish is a co-equal language, not a translation afterthought.

Key terminology (always consistent):
- listing / anuncio
- provider / proveedor
- trade / intercambio
- neighborhood / vecindario
- hire/book / contratar
- sign up / registrarse
- log in / iniciar sesión

---

## Go-to-Market Context

- **Target launch**: Santa Cruz County, CA only
- **Cold start strategy**: Seed 20+ provider listings personally before any public marketing
- **Key communities**: SC Buy Nothing groups, Nextdoor, SC Mutual Aid, Watsonville Spanish FB groups
- **Success metric at 60 days**: 100 registered users, 50 active listings, 10 completed transactions

---

## File Structure (suggested)

```
src/
  lib/
    components/
      ui/           # Button, Input, Card, Badge, Avatar, Nav
      listings/     # ListingCard, ListingGrid, ListingDetail
      booking/      # BookingForm, OrderSummary, BookingConfirmation
      messages/     # ThreadList, MessageBubble
    server/
      db.ts         # Supabase client
      stripe.ts     # Stripe Connect helpers
    i18n/           # paraglide messages
  routes/
    +layout.svelte
    +page.svelte              # Landing
    browse/+page.svelte
    listings/[id]/+page.svelte
    listings/[id]/book/+page.svelte
    post/+page.svelte
    profile/[username]/+page.svelte
    messages/+page.svelte
    auth/
      signup/+page.svelte
      login/+page.svelte
      onboarding/+page.svelte
```

---

## Environment Variables Needed

```
PUBLIC_SUPABASE_URL=
PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
PUBLIC_STRIPE_PUBLISHABLE_KEY=
PUBLIC_MAPBOX_TOKEN=
ANTHROPIC_API_KEY=   # for AI matching in Phase 2
```
