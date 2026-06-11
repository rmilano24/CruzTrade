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
- A [Stripe](https://stripe.com) account (for payment features)

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
PUBLIC_MAPBOX_TOKEN=pk.eyJ1...
ANTHROPIC_API_KEY=sk-ant-...
```

> The app runs without Supabase/Stripe keys during early development — those features will simply be inactive.

**3. Start the dev server**

```bash
npm run dev
```

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

## Project Structure

```
src/
├── app.html                  # Root HTML template (sets lang attr via paraglide)
├── app.css                   # Tailwind directives + Inter font imports
├── app.d.ts                  # TypeScript ambient types (Supabase locals)
├── hooks.ts                  # Universal hooks — paraglide reroute (/es/* URLs)
├── hooks.server.ts           # Server hooks — Supabase session + i18n handle
└── lib/
    ├── i18n.ts               # paraglide createI18n instance
    ├── server/
    │   ├── db.ts             # Supabase server client factory
    │   └── stripe.ts         # Stripe Connect helpers (stub)
    └── components/
        ├── ui/               # Button, Input, Card, Badge, Avatar, Nav
        ├── listings/         # ListingCard, ListingGrid, ListingDetail
        ├── booking/          # BookingForm, OrderSummary, BookingConfirmation
        └── messages/         # ThreadList, MessageBubble

routes/
├── +layout.svelte            # Root layout — Nav + ParaglideJS wrapper
├── +page.svelte              # Landing page
├── browse/                   # Browse listings
├── listings/[id]/            # Listing detail
├── listings/[id]/book/       # Booking flow
├── listings/[id]/book/confirmation/
├── post/                     # Post a service or tool rental
├── profile/[username]/       # Public provider profile
├── messages/                 # In-app messaging
└── auth/
    ├── signup/
    ├── login/
    └── onboarding/

messages/
├── en.json                   # English strings (source language)
└── es.json                   # Spanish strings
```

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

The generated `src/lib/paraglide/` directory is gitignored — it's compiled automatically by the Vite plugin when you run `npm run dev` or `npm run build`.

**Language routing:** English is unprefixed (`/browse`). Spanish uses the `/es/` prefix (`/es/browse`). The language toggle in the Nav switches between them.

---

## Database Setup

The full schema is documented in [`CLAUDE.md`](./CLAUDE.md). To set up a fresh Supabase project:

1. Create a new project at [supabase.com](https://supabase.com)
2. Enable the `pgvector` extension (Database → Extensions)
3. Run the SQL from the schema section of `CLAUDE.md` in the SQL editor
4. Enable Row Level Security on every table
5. Copy your project URL and keys into `.env`

**Tables:** `profiles`, `listings`, `transactions`, `reviews`, `messages`, `regions`

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

## MVP Scope

**Building now (Phase 1):**
- Auth (sign up, log in, onboarding)
- Browse listings with category + neighborhood filter
- Post a listing (service or tool rental)
- Listing detail + booking flow
- Stripe Connect payments + deposit holds for tool rentals
- In-app messaging (Supabase Realtime)
- Reviews after completed transactions
- Provider profile page
- EN + ES language toggle

**Phase 2 (not yet):**
- AI semantic matching (pgvector column is already on `listings`, feature ships later)
- Mobile app / PWA
- Pro Profile / SEO mini-website
- Verification / ID check
- Digest email notifications
