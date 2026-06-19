# Cruz Trade

A hyperlocal skill trade and tool rental marketplace for Santa Cruz County, CA. Neighbors hire each other for services, rent tools, or trade skills directly (barter). Bilingual English/Spanish from day one.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | [SvelteKit](https://kit.svelte.dev) |
| Styling | [Tailwind CSS v3](https://tailwindcss.com) |
| Auth | [Supabase Auth](https://supabase.com/docs/guides/auth) |
| Database | [Supabase](https://supabase.com) (PostgreSQL + pgvector) |
| File Storage | Supabase Storage |
| Payments | [Stripe Connect](https://stripe.com/connect) |
| Real-time | Supabase Realtime |
| i18n | [paraglide-js](https://inlang.com/m/gerre34r/library-inlang-paraglideJs) (EN + ES) |
| Font | Inter via [@fontsource/inter](https://fontsource.org/fonts/inter) |

---

## Prerequisites

- Node.js 22+ (required — `@supabase/realtime-js` throws on Node < 22 without a WebSocket polyfill)
- npm 9+
- A [Supabase](https://supabase.com) project
- A [Stripe](https://stripe.com) account with Connect enabled
- [Stripe CLI](https://stripe.com/docs/stripe-cli) (for local webhook testing)

---

## Getting Started

**1. Clone and install**

```bash
git clone git@github.com:rmilano24/CruzTrade.git
cd CruzTrade
npm install
```

**2. Set up environment variables**

```bash
cp .env.example .env
```

Open `.env` and fill in your keys:

```env
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
PUBLIC_MAPBOX_TOKEN=         # optional — maps not yet wired
ANTHROPIC_API_KEY=           # optional — AI matching is Phase 2
```

**3. Set up the database**

In the Supabase SQL editor, run these files in order:
1. `supabase/schema.sql` — creates all tables, enables pgvector, sets up RLS
2. `supabase/migrations/001_phase2_columns.sql` — adds Phase 2 columns
3. `supabase/migrations/update_category_constraint.sql` — updates category values to the current taxonomy

**4. Configure Supabase auth redirect**

In the Supabase dashboard go to **Authentication → URL Configuration** and add:
```
http://localhost:5173/auth/callback
```
to the **Redirect URLs** list.

**5. Run the dev servers**

You need **two terminal tabs** running at the same time:

*Terminal 1 — app server:*
```bash
npm run dev
```

*Terminal 2 — Stripe webhook listener:*
```bash
stripe listen --forward-to localhost:5173/api/stripe/webhook
```

The `stripe listen` command prints a `whsec_...` signing secret — paste it into `.env` as `STRIPE_WEBHOOK_SECRET`, then restart `npm run dev`.

Open [http://localhost:5173](http://localhost:5173).

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start local dev server with HMR |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build locally |
| `npm run check` | Run `svelte-check` type checking |
| `npm run check:watch` | Type checking in watch mode |

---

## Routes

| Route | Description |
|---|---|
| `/` | Homepage — hero + Hire / Trade / Rent carousel sections |
| `/hire` | Hire a neighbor — service listings by category |
| `/trade` | Trade skills — barter listings by category |
| `/rent` | Rent tools & gear — rental listings by category |
| `/browse` | Legacy browse — filter by type, category, neighborhood |
| `/listings/[id]` | Listing detail — description, provider, Hire/Trade/Message CTAs |
| `/listings/[id]/edit` | Edit listing — owner only |
| `/listings/[id]/book` | Booking form — payment or trade |
| `/listings/[id]/book/confirmation` | Booking confirmation — receipt, escrow notice |
| `/post` | Post a listing — service or tool rental |
| `/profile/[username]` | Provider profile — listings, reviews, Stripe connect |
| `/dashboard` | User dashboard — active bookings, messages, nearby listings |
| `/my-listings` | Manage your listings |
| `/my-bookings` | Your bookings as buyer |
| `/messages` | Messaging — thread list + conversation view |
| `/reviews/[transaction_id]` | Leave a review after completed job |
| `/settings` | Account settings — profile info, avatar upload |
| `/how-it-works` | How Cruz Trade works — Hire / Trade / Rent tabs |
| `/auth/signup` | Sign up |
| `/auth/login` | Log in |
| `/auth/onboarding` | 3-step onboarding — profile, neighborhood, first listing |

---

## Category Taxonomy

Each listing has a `category` field. Current values:

**Service listings** (`type = 'service'`):

| Slug | Label |
|---|---|
| `home_yard` | Home & Yard |
| `tech_creative` | Tech & Creative |
| `lessons` | Lessons & Tutoring |
| `wellness` | Wellness & Beauty |
| `care_errands` | Care & Errands |

**Rental listings** (`type = 'tool_rental'`):

| Slug | Label |
|---|---|
| `tools_equipment` | Tools & Equipment |
| `outdoor_adventure` | Outdoor & Adventure |
| `party_events` | Party & Events |
| `garden_yard` | Garden & Yard |
| `vehicles` | Vehicles & Trailers |

Trade listings are service listings with `accepts_trade = true` — they share the service category slugs.

---

## Seed Data

`scripts/seed.mjs` creates 7 provider accounts and 38 listings covering all categories and neighborhoods. The script wipes existing listings before inserting, so it's safe to re-run.

**First-time setup:** run the category constraint migration before seeding:

```sql
-- Run in Supabase SQL editor
ALTER TABLE listings DROP CONSTRAINT IF EXISTS listings_category_check;
ALTER TABLE listings ADD CONSTRAINT listings_category_check CHECK (
  category IN (
    'home_yard', 'tech_creative', 'lessons', 'wellness', 'care_errands',
    'tools_equipment', 'outdoor_adventure', 'party_events', 'garden_yard', 'vehicles'
  )
);
```

Then run the seed:

```bash
node --env-file=.env scripts/seed.mjs --dry-run   # preview only
node --env-file=.env scripts/seed.mjs              # insert for real
```

**Seed providers** (all share the same password: `CruzTrade-seed-2026!`):

| Name | Neighborhood | Offers |
|---|---|---|
| Maria Gonzalez | Watsonville | Garden, cleaning, childcare, Spanish tutoring |
| Jake Torres | Westside | Moving/hauling, guitar lessons, dog walking, trailer + bike rental |
| Sofia Reyes | Downtown | Web design, social media, PA system + e-bike rental |
| Carlos Mendoza | Live Oak | Yard work, pruning, mower + drill + truck rental |
| Dana Kim | Aptos | Yoga, massage, painting classes, kayak + sewing machine rental |
| Tony Bruno | Soquel | Fencing, carpentry, event tent + pressure washer + tile saw rental |
| Priya Sharma | Eastside | Laptop repair, WiFi setup, errand running, Reiki |

---

## Project Structure

```
src/
├── hooks.ts                      # Universal hooks — paraglide reroute (/es/* URLs)
├── hooks.server.ts               # Server hooks — Supabase session + i18n handle
└── lib/
    ├── i18n.ts                   # paraglide createI18n instance
    ├── neighborhoods.ts          # Santa Cruz County neighborhood list
    ├── utils/format.ts           # formatPrice, categoryLabel, typeLabel helpers
    ├── server/
    │   ├── db.ts                 # Supabase client factory (SSR-aware + admin)
    │   ├── listings.ts           # Shared loadListings() helper
    │   └── stripe.ts             # Stripe client + fee helpers
    └── components/
        ├── ui/
        │   ├── Nav.svelte        # Top nav — logo, All/Hire/Trade/Rent tabs, search bar
        │   └── Footer.svelte
        └── listings/
            ├── ListingCard.svelte
            ├── ListingsGrid.svelte
            ├── CategoryBar.svelte      # Anchor-scroll category chips
            ├── CategorySections.svelte # Grouped carousel view (hire/trade/rent pages)
            └── CarouselSection.svelte  # Single category section with horizontal carousel

src/routes/
├── +page.svelte / +page.server.ts          # Homepage
├── hire/                                   # /hire — service listings
├── trade/                                  # /trade — trade listings
├── rent/                                   # /rent — rental listings
├── listings/[id]/                          # Listing detail
├── listings/[id]/book/                     # Booking flow
├── post/                                   # Post a listing
├── profile/[username]/                     # Provider profile
├── dashboard/                              # User dashboard
├── my-listings/                            # Manage listings
├── my-bookings/                            # Booking history
├── messages/                              # Messaging
├── settings/                              # Account settings
├── how-it-works/                          # How it works page
├── auth/signup|login|onboarding|callback/ # Auth flow
└── api/stripe/
    ├── connect/    # Start Stripe Express onboarding
    ├── return/     # Stripe redirects here after onboarding
    └── webhook/    # Receives Stripe events, updates transaction status

messages/
├── en.json         # English strings
└── es.json         # Spanish strings

supabase/
├── schema.sql
├── migrations/
│   ├── 001_phase2_columns.sql
│   └── update_category_constraint.sql
└── seed.sql
```

---

## Stripe Setup

Cruz Trade uses [Stripe Connect](https://stripe.com/connect) for marketplace payments (7% platform fee, 20% deposit for tool rentals).

**1. Enable Connect** — Stripe dashboard → More → Connect → Get started

**2. Get API keys** — Developers → API keys → copy into `.env`

**3. Local webhook listener:**

```bash
brew install stripe/stripe-cli/stripe   # first time only
stripe login                            # first time only
stripe listen --forward-to localhost:5173/api/stripe/webhook
```

Copy the printed `whsec_...` into `.env` as `STRIPE_WEBHOOK_SECRET`, restart `npm run dev`.

**Test cards:**

| Card | Use |
|---|---|
| `4242 4242 4242 4242` | Successful payment |
| `4000 0000 0000 9995` | Declined |

---

## Database Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. In **Database → Extensions**, enable `vector` (pgvector)
3. Run `supabase/schema.sql` in the SQL editor
4. Run `supabase/migrations/001_phase2_columns.sql`
5. Run `supabase/migrations/update_category_constraint.sql`
6. Copy your project URL and keys into `.env`
7. In **Authentication → URL Configuration**, add `http://localhost:5173/auth/callback` to Redirect URLs
8. Seed the database (see **Seed Data** section)

RLS is enabled on every table. The service role key bypasses RLS — keep it server-side only.

---

## Google OAuth Setup

**1.** Go to [console.cloud.google.com](https://console.cloud.google.com) → create project `CruzTrade`

**2.** APIs & Services → Credentials → OAuth client ID → Web application
- Authorized redirect URIs: `https://[your-ref].supabase.co/auth/v1/callback` and `http://localhost:5173/auth/callback`
- Download JSON, copy `client_id` and `client_secret`

**3.** Supabase → Authentication → Providers → Google → toggle on, paste credentials

**4.** Add test users: Google Cloud → Google Auth Platform → Audience → Test users

> For production, publish the OAuth app (Audience → Publish app). No Google verification required since we only use email + profile scopes.

---

## Supabase Storage Setup

**`listing-images` bucket** — Public, no extra RLS policies needed.

**`avatars` bucket** — Public, plus these three RLS policies:

```sql
CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'avatars' AND name LIKE (auth.uid()::text || '.%'));

CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'avatars' AND name LIKE (auth.uid()::text || '.%'));

CREATE POLICY "Public can view avatars"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'avatars');
```

---

## Design System

Tokens live in `tailwind.config.js` — use Tailwind classes only, no inline styles.

| Token | Value | Usage |
|---|---|---|
| `bg-primary` | `#f97316` | CTAs, active states |
| `bg-bg` | `#ffffff` | Page background / cards |
| `bg-bg-card` | `#f5f5f5` | Page background on "app" pages |
| `bg-bg-secondary` | `#f0f0f0` | Input backgrounds |
| `border-border` | `#e0e0e0` | All borders |
| `text-text-primary` | `#111111` | Body text |
| `text-text-muted` | `#666666` | Secondary text |

**Component patterns:**
- Primary button: `bg-primary text-white font-semibold px-5 py-2.5 rounded-md hover:bg-primary-hover`
- Ghost button: `border border-border text-text-primary font-semibold px-5 py-2.5 rounded-md`
- Card: `bg-bg border border-border rounded-xl p-4`
- Input: `bg-bg-secondary border border-border rounded-md px-3.5 py-2.5 text-base focus:border-primary focus:outline-none`
- Badge/pill: `bg-bg-secondary text-text-muted text-xs px-2.5 py-1 rounded-full`

**Page background pattern** ("app" pages like dashboard, listings, bookings):
- Outer wrapper: `min-h-screen bg-bg-card`
- Content cards: `bg-bg border border-border rounded-xl`

---

## Going to Production

- [ ] Run all three SQL files on the production Supabase project (schema + migrations)
- [ ] Add production domain to Supabase redirect URLs
- [ ] Create `listing-images` and `avatars` storage buckets with correct policies
- [ ] Add production redirect URI to Google Cloud OAuth credentials
- [ ] Publish Google OAuth app (Audience → Publish app)
- [ ] Switch Stripe keys to live (`sk_live_` / `pk_live_`)
- [ ] Create permanent Stripe webhook endpoint pointing to `https://yourdomain.com/api/stripe/webhook`
- [ ] Update `STRIPE_WEBHOOK_SECRET` to the permanent endpoint's signing secret
- [ ] Complete Stripe account verification before processing live payments

---

## Phase 2 Roadmap

- AI semantic matching via pgvector (`embedding` column already on `listings`)
- "Need a Hand" demand-side posts
- Weekly neighborhood digest email (Resend)
- Auto-translation in messaging (Claude Haiku)
- Recurring bookings
- Tool condition photo documentation at pickup/return
- Community vouching
- Pro Profile mini-website (~$12/mo)
- Verified identity / background checks
- Native iOS app
