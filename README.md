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

- Node.js 18+
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

Open `.env` and fill in your keys (see the Stripe Setup and Database Setup sections below for how to get each one):

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

In the Supabase SQL editor, run these two files in order:
1. `supabase/schema.sql` — creates all tables, enables pgvector, sets up RLS
2. `supabase/migrations/001_phase2_columns.sql` — adds Phase 2 columns

To load test listings (required for local dev):
3. `supabase/seed.sql` — creates seed user `seed@cruztrade.test` / `SeedPass123!` with 5 sample listings

**4. Configure Supabase auth redirect**

In the Supabase dashboard go to **Authentication → URL Configuration** and add:
```
http://localhost:5173/auth/callback
```
to the **Redirect URLs** list. Without this, email confirmation links will fail.

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

## Screens

| Route | Screen |
|---|---|
| `/` | Landing page — hero, how it works, featured listings |
| `/browse` | Browse listings — filter by category, type, neighborhood |
| `/listings/[id]` | Listing detail — description, provider, Hire/Trade/Message CTAs |
| `/listings/[id]/book` | Booking form — pay or trade, date, job description |
| `/listings/[id]/book/confirmation` | Booking confirmation — receipt, escrow notice |
| `/post` | Post a listing — service or tool rental form |
| `/profile/[username]` | Provider profile — listings, reviews, Stripe connect |
| `/messages` | Messaging — thread list + conversation view |
| `/auth/signup` | Sign up |
| `/auth/login` | Log in |
| `/auth/onboarding` | 3-step onboarding — profile, neighborhood, first listing |

All routes available in English and Spanish (`/es/` prefix for Spanish).

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
    │   └── stripe.ts             # Stripe client + platformFee/depositAmount helpers
    └── components/
        ├── ui/Nav.svelte         # Top navigation with auth state
        └── listings/ListingCard.svelte

src/routes/
├── +page.svelte / +page.server.ts          # Landing
├── browse/                                 # Browse listings
├── listings/[id]/                          # Listing detail
├── listings/[id]/book/                     # Booking form
├── listings/[id]/book/confirmation/        # Booking confirmation
├── post/                                   # Post a listing
├── profile/[username]/                     # Provider profile
├── messages/                              # Messaging
├── auth/signup|login|onboarding|callback/ # Auth flow
└── api/stripe/
    ├── connect/    # Start Stripe Express onboarding (GET → redirect to Stripe)
    ├── return/     # Stripe redirects here after provider onboarding
    └── webhook/    # Receives Stripe events, updates transaction status

messages/
├── en.json         # English strings (source language)
└── es.json         # Spanish strings

supabase/
├── schema.sql                      # Full database schema
├── migrations/001_phase2_columns.sql
└── seed.sql                        # Test data (5 listings, 1 user)
```

---

## Stripe Setup

Cruz Trade uses [Stripe Connect](https://stripe.com/connect) for marketplace payments (7% platform fee, 20% deposit for tool rentals).

**1. Enable Connect**

In the Stripe dashboard go to **More → Connect → Get started** and enable Connect for your account.

**2. Get your API keys**

Go to **Developers → API keys** and copy your publishable and secret keys into `.env`.

**3. Local webhook listener**

Stripe needs to notify your app when payments complete. Keep this running alongside `npm run dev`:

```bash
# Install Stripe CLI (first time only)
brew install stripe/stripe-cli/stripe

# Log in (first time only)
stripe login

# Forward webhook events to local dev server
stripe listen --forward-to localhost:5173/api/stripe/webhook
```

Copy the printed `whsec_...` value into `.env` as `STRIPE_WEBHOOK_SECRET`, then restart `npm run dev`.

> **Note:** The `whsec_` key from `stripe listen` expires after 90 days — re-run `stripe login` when it does. For production, create a permanent webhook endpoint in the Stripe dashboard pointing to `https://yourdomain.com/api/stripe/webhook`.

**4. Provider onboarding**

Providers connect their Stripe account to receive payouts from their profile page (**Connect Stripe** button). This uses Stripe Express — in test mode, Stripe provides pre-filled test data to complete onboarding.

**Test card numbers:**

| Card | Use |
|---|---|
| `4242 4242 4242 4242` | Successful payment |
| `4000 0000 0000 9995` | Declined payment |

Use any future expiry date and any 3-digit CVC.

---

## Database Setup

**Tables:** `profiles`, `listings`, `transactions`, `reviews`, `messages`, `regions`

To set up a fresh Supabase project:

1. Create a new project at [supabase.com](https://supabase.com)
2. In **Database → Extensions**, enable `vector` (pgvector)
3. In the SQL editor, run `supabase/schema.sql`
4. Then run `supabase/migrations/001_phase2_columns.sql`
5. For local dev, run `supabase/seed.sql` to load test data
6. Copy your project URL and keys into `.env`
7. In **Authentication → URL Configuration**, add `http://localhost:5173/auth/callback` to Redirect URLs

RLS is enabled on every table from day one. The service role key (used only in the webhook handler) bypasses RLS — keep it server-side only.

---

## Google OAuth Setup

Cruz Trade supports "Continue with Google" on the sign-in and sign-up pages. Setup is a one-time process per environment.

**1. Create a Google Cloud project**

1. Go to [console.cloud.google.com](https://console.cloud.google.com) — use a personal Gmail account (Workspace accounts may lack org-level permissions)
2. Create a new project named `CruzTrade`

**2. Create OAuth credentials**

1. Go to **APIs & Services → Credentials → + Create Credentials → OAuth client ID**
2. Application type: **Web application**, name it `Cruz Trade Web`
3. Under **Authorized redirect URIs**, add:
   - `https://[your-supabase-project-ref].supabase.co/auth/v1/callback`
   - `http://localhost:5173/auth/callback` (local dev)
4. Click **Create** — immediately **Download JSON** from the creation modal (the only time the secret is shown cleanly)
5. From the JSON, copy `client_id` and `client_secret`

**3. Enable Google in Supabase**

1. Go to Supabase → **Authentication → Providers → Google**
2. Toggle on, paste Client ID and Client Secret, save
3. Copy the **Callback URL** shown — verify it matches what you added in step 2

**4. Add test users (while app is in Testing mode)**

1. Go to Google Cloud → **Google Auth Platform → Audience**
2. Scroll to **Test users → + Add users**
3. Add any Gmail addresses that need to sign in before the app is published

**5. Add localhost to Supabase redirect allowlist**

In Supabase → **Authentication → URL Configuration → Redirect URLs**, add:
```
http://localhost:5173/auth/callback
```

> **Production note:** When ready to go live, publish the OAuth app in Google Cloud (**Audience → Publish app**) so any Google account can sign in — not just test users. You'll need to complete Google's verification form if requesting sensitive scopes (we only use email + profile, so verification is not required).

---

## Supabase Storage Setup

Listing images are stored in Supabase Storage under a public bucket called `listing-images`.

**Create the bucket (one-time):**

1. Go to Supabase → **Storage → New bucket**
2. Name: `listing-images`
3. Toggle **Public bucket** on (images are publicly readable by URL)
4. Leave file size limit blank (5 MB limit is enforced server-side in `src/routes/post/+page.server.ts`)
5. Save

No additional RLS policies are needed — the bucket is public for reads, and uploads go through the authenticated server action which uses the service role key.

---

## i18n (Bilingual EN/ES)

All user-facing strings go through [paraglide-js](https://inlang.com/m/gerre34r/library-inlang-paraglideJs) — never hardcode English text directly in components.

**Adding or editing strings:**

1. Add the key to both `messages/en.json` and `messages/es.json`
2. Use underscores for key names: `nav_browse`, `page_home_title`
3. Import and call in components:

```svelte
<script>
  import * as m from '$lib/paraglide/messages'
</script>

<h1>{m.page_home_title()}</h1>
```

The generated `src/lib/paraglide/` directory is gitignored — compiled automatically by the Vite plugin.

**Language routing:** English is unprefixed (`/browse`). Spanish uses the `/es/` prefix (`/es/browse`). The language toggle in the Nav switches between them.

---

## Design System

Design tokens live in `tailwind.config.js`. Use Tailwind classes exclusively — no inline styles.

| Token | Value | Usage |
|---|---|---|
| `bg-primary` | `#f97316` | CTAs, active states |
| `bg-bg` | `#ffffff` | Page background |
| `bg-bg-card` | `#f5f5f5` | Cards, panels |
| `bg-bg-secondary` | `#f0f0f0` | Input backgrounds |
| `border-border` | `#e0e0e0` | All borders |
| `text-text-primary` | `#111111` | Body text |
| `text-text-muted` | `#666666` | Secondary text |

**Component patterns:**
- Primary button: `bg-primary text-white font-semibold px-5 py-2.5 rounded-md hover:bg-primary-hover`
- Ghost button: `border border-border text-text-primary font-semibold px-5 py-2.5 rounded-md`
- Card: `bg-bg-card border border-border rounded-lg p-4 shadow-card`
- Input: `bg-bg-secondary border border-border rounded-md px-3.5 py-2.5 text-base focus:border-primary focus:outline-none`

---

## Going to Production

Checklist before flipping live:

**Supabase**
- [ ] Run `supabase/schema.sql` + `supabase/migrations/001_phase2_columns.sql` on the production Supabase project
- [ ] Add your production domain to Supabase **Authentication → URL Configuration** redirect URLs (e.g. `https://yourdomain.com/auth/callback`)
- [ ] Create `listing-images` storage bucket (public) in the production Supabase project

**Google OAuth**
- [ ] Add production redirect URI to Google Cloud OAuth credentials: `https://yourdomain.com/auth/callback` (alongside the Supabase one)
- [ ] Publish the OAuth app in Google Cloud (**Audience → Publish app**) so all Google accounts can sign in

**Stripe**
- [ ] Switch Stripe keys from `sk_test_` / `pk_test_` to `sk_live_` / `pk_live_`
- [ ] Create a permanent webhook endpoint in Stripe dashboard → **Developers → Webhooks → Add destination**, pointing to `https://yourdomain.com/api/stripe/webhook`, listening for `checkout.session.completed`, `checkout.session.expired`, `payment_intent.payment_failed`
- [ ] Update `STRIPE_WEBHOOK_SECRET` in production env to the new `whsec_` from the permanent endpoint
- [ ] Complete Stripe account verification (**Verify your business** in Stripe dashboard) before going live

**Launch**
- [ ] Seed at least 20 real listings before public marketing

---

## Phase 2 Roadmap

- AI semantic matching via pgvector (column already on `listings` table)
- "Need a Hand" demand-side posts
- Weekly neighborhood digest email (Resend)
- Recurring bookings
- Tool condition photo documentation
- Pro Profile mini-website (~$12/mo subscription)
- Verified identity / background checks
- Native iOS app
