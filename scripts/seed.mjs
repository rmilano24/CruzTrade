/**
 * Cruz Trade seed script
 * Creates 7 provider accounts + 26 listings covering all categories.
 *
 * Run: node --env-file=.env scripts/seed.mjs
 *
 * Safe to re-run — uses upsert on profiles and skips user creation if email
 * already exists. Listings are always inserted fresh (add --dry-run to preview).
 */

import { createClient } from '@supabase/supabase-js';
import ws from 'ws';

const DRY_RUN = process.argv.includes('--dry-run');

const supabase = createClient(
  process.env.PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false }, realtime: { transport: ws } }
);

// ---------------------------------------------------------------------------
// Provider accounts
// ---------------------------------------------------------------------------

const providers = [
  {
    email: 'maria.g.seed@cruztrade.com',
    password: 'CruzTrade-seed-2026!',
    profile: {
      username: 'mariag',
      full_name: 'Maria Gonzalez',
      avatar_url: 'https://randomuser.me/api/portraits/women/44.jpg',
      bio: 'Gardener, house cleaner, and translator based in Watsonville. Bilingual English/Spanish. Happy to trade skills!',
      neighborhood: 'Watsonville',
      language_preference: 'es',
    },
  },
  {
    email: 'jake.t.seed@cruztrade.com',
    password: 'CruzTrade-seed-2026!',
    profile: {
      username: 'jaket',
      full_name: 'Jake Torres',
      avatar_url: 'https://randomuser.me/api/portraits/men/32.jpg',
      bio: 'Westside local. I help neighbors move stuff, fix guitars, and rent out tools I\'ve collected over the years.',
      neighborhood: 'Westside',
      language_preference: 'en',
    },
  },
  {
    email: 'sofia.r.seed@cruztrade.com',
    password: 'CruzTrade-seed-2026!',
    profile: {
      username: 'sofiar',
      full_name: 'Sofia Reyes',
      avatar_url: 'https://randomuser.me/api/portraits/women/68.jpg',
      bio: 'Designer and web person downtown. I help small businesses get online and look good doing it.',
      neighborhood: 'Downtown',
      language_preference: 'en',
    },
  },
  {
    email: 'carlos.m.seed@cruztrade.com',
    password: 'CruzTrade-seed-2026!',
    profile: {
      username: 'carlosm',
      full_name: 'Carlos Mendoza',
      avatar_url: 'https://randomuser.me/api/portraits/men/75.jpg',
      bio: 'Live Oak neighbor. Yard work, landscaping, hauling. I also rent out my lawn mower and drill.',
      neighborhood: 'Live Oak',
      language_preference: 'es',
    },
  },
  {
    email: 'dana.k.seed@cruztrade.com',
    password: 'CruzTrade-seed-2026!',
    profile: {
      username: 'danak',
      full_name: 'Dana Kim',
      avatar_url: 'https://randomuser.me/api/portraits/women/17.jpg',
      bio: 'Certified yoga instructor and massage therapist in Aptos. Also teach watercolor classes and rent out my sewing machine.',
      neighborhood: 'Aptos',
      language_preference: 'en',
    },
  },
  {
    email: 'tony.b.seed@cruztrade.com',
    password: 'CruzTrade-seed-2026!',
    profile: {
      username: 'tonyb',
      full_name: 'Tony Bruno',
      avatar_url: 'https://randomuser.me/api/portraits/men/51.jpg',
      bio: 'Soquel contractor. Fencing, carpentry, furniture assembly. I own a lot of tools I\'m happy to rent out.',
      neighborhood: 'Soquel',
      language_preference: 'en',
    },
  },
  {
    email: 'priya.s.seed@cruztrade.com',
    password: 'CruzTrade-seed-2026!',
    profile: {
      username: 'priyas',
      full_name: 'Priya Sharma',
      avatar_url: 'https://randomuser.me/api/portraits/women/22.jpg',
      bio: 'Tech support and holistic wellness. I fix laptops, set up home networks, and offer reiki. Eastside Santa Cruz.',
      neighborhood: 'Eastside',
      language_preference: 'en',
    },
  },
];

// ---------------------------------------------------------------------------
// Listings factory — keyed by provider email
// ---------------------------------------------------------------------------

// Curated Unsplash photos per listing topic
const IMG = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&q=80`;

const listings = [
  // --- Maria ---
  {
    provider: 'maria.g.seed@cruztrade.com',
    type: 'service',
    title: 'Organic garden planting & seasonal maintenance',
    image_url: IMG('1523741543316-beb7fc7023d8'), // vegetable garden
    description: 'I\'ve been gardening in Santa Cruz County for 12 years and know what grows well here. I can help you plan, plant, and maintain a vegetable garden, flower beds, or native plant garden. I use only organic methods — no synthetic pesticides or fertilizers. Available for one-time plantings or ongoing monthly maintenance. Bilingual English/Spanish.',
    category: 'home_yard',
    price: 6500,
    price_unit: 'per_hour',
    neighborhood: 'Watsonville',
    language: 'both',
    accepts_trade: true,
    trade_description: 'Happy to trade for cooking, childcare, or tech help',
  },
  {
    provider: 'maria.g.seed@cruztrade.com',
    type: 'service',
    title: 'House & apartment deep cleaning',
    image_url: IMG('1585771724684-38269d6639fd'), // cleaning supplies
    description: 'Thorough, reliable house cleaning for homes and apartments in South County. I bring all my own supplies. Deep cleans, move-in/move-out cleans, and regular bi-weekly service available. I\'ve been doing this for 8 years and have great references. Spanish y inglés.',
    category: 'home_yard',
    price: 12000,
    price_unit: 'flat',
    neighborhood: 'Watsonville',
    language: 'both',
    accepts_trade: false,
    trade_description: null,
  },
  {
    provider: 'maria.g.seed@cruztrade.com',
    type: 'service',
    title: 'Spanish ↔ English translation & tutoring',
    image_url: IMG('1434030216411-0b793f4b4173'), // books / studying
    description: 'Native Spanish speaker with professional translation experience. I can translate documents, help with business communications, or teach conversational Spanish. I also teach English to Spanish speakers. All levels welcome. Flexible scheduling including evenings and weekends.',
    category: 'lessons',
    price: 4000,
    price_unit: 'per_hour',
    neighborhood: 'Watsonville',
    language: 'both',
    accepts_trade: true,
    trade_description: 'Trade for garden help, cooking lessons, or childcare',
  },

  // --- Jake ---
  {
    provider: 'jake.t.seed@cruztrade.com',
    type: 'service',
    title: 'Moving help & hauling — truck included',
    image_url: IMG('1568605114967-8130f3a36994'), // pickup truck
    description: 'I have a full-size pickup truck and can help you move furniture, haul junk to the dump, pick up Craigslist finds, or assist with small moves within Santa Cruz County. I\'m strong, reliable, and on time. Minimum 2-hour booking. Second helper available for an extra $20/hr.',
    category: 'care_errands',
    price: 8000,
    price_unit: 'per_hour',
    neighborhood: 'Westside',
    language: 'en',
    accepts_trade: false,
    trade_description: null,
  },
  {
    provider: 'jake.t.seed@cruztrade.com',
    type: 'service',
    title: 'Beginner & intermediate guitar lessons',
    image_url: IMG('1525201548942-d8732f6617a0'), // acoustic guitar
    description: 'I\'ve been playing guitar for 20 years and teaching for 8. I can teach acoustic or electric, any genre — folk, rock, blues, fingerpicking. I\'m patient and encouraging, great with kids and adults alike. Lessons at your place or mine on the Westside.',
    category: 'lessons',
    price: 5500,
    price_unit: 'per_hour',
    neighborhood: 'Westside',
    language: 'en',
    accepts_trade: true,
    trade_description: 'Trade for cooking, garden help, or home repairs',
  },
  {
    provider: 'jake.t.seed@cruztrade.com',
    type: 'tool_rental',
    title: '10 ft fiberglass ladder — daily or weekend rental',
    image_url: IMG('1572981779307-38b8cabb2407'), // ladder
    description: 'Werner fiberglass step ladder, 10 feet, 300 lb capacity. Great for cleaning gutters, painting, trimming trees. Well maintained and safe. Pick up on the Westside. Leave a small deposit via Stripe, returned when you bring it back in good shape.',
    category: 'tools_equipment',
    price: 1500,
    price_unit: 'per_day',
    neighborhood: 'Westside',
    language: 'en',
    accepts_trade: false,
    trade_description: null,
  },
  {
    provider: 'jake.t.seed@cruztrade.com',
    type: 'tool_rental',
    title: '6-person camping tent + sleeping pads (weekend bundle)',
    image_url: IMG('1500534314209-a25ddb2bd429'), // camping tent
    description: 'REI Co-op 6-person tent in great condition, plus 4 foam sleeping pads. Perfect for Big Basin, Henry Cowell, or a Steelhead beach weekend. Fits in a sedan. Available most weekends — message to check dates. Deposit held via Stripe.',
    category: 'outdoor_adventure',
    price: 4000,
    price_unit: 'per_day',
    neighborhood: 'Westside',
    language: 'en',
    accepts_trade: false,
    trade_description: null,
  },

  // --- Sofia ---
  {
    provider: 'sofia.r.seed@cruztrade.com',
    type: 'service',
    title: 'Website setup for small businesses & makers',
    image_url: IMG('1467232004584-a241de8bcf5d'), // laptop / web design
    description: 'I design and build simple, clean websites for Santa Cruz County small businesses, artists, and makers. Squarespace, Wix, or basic WordPress. I can also help with Google Business Profile setup, basic SEO, and connecting online ordering. Flat-rate packages available — message me to discuss your project.',
    category: 'tech_creative',
    price: 8000,
    price_unit: 'per_hour',
    neighborhood: 'Downtown',
    language: 'en',
    accepts_trade: true,
    trade_description: 'Trade for massage, yoga, or cooking',
  },
  {
    provider: 'sofia.r.seed@cruztrade.com',
    type: 'service',
    title: 'Social media content creation & strategy',
    image_url: IMG('1611162617213-7d7a39e9b1d7'), // phone / social media
    description: 'Consistent, on-brand social media is hard to keep up with. I can create a month\'s worth of posts, set up a content calendar, or help you define your brand voice. I work with Instagram, Facebook, and TikTok. I understand Santa Cruz\'s community vibe and what resonates locally.',
    category: 'tech_creative',
    price: 5000,
    price_unit: 'per_hour',
    neighborhood: 'Downtown',
    language: 'en',
    accepts_trade: false,
    trade_description: null,
  },
  {
    provider: 'sofia.r.seed@cruztrade.com',
    type: 'tool_rental',
    title: 'Cargo e-bike rental — errands, beach, farmers market',
    image_url: IMG('1571333250630-f0230c320b6d'), // cargo e-bike
    description: 'Rad Power Bikes RadWagon cargo e-bike. Perfect for the farmers market, beach runs, or getting around without a car. Can carry 350 lbs including rider + cargo. Helmet included. Pick up near downtown SC. Message to check availability. Daily or half-day rates.',
    category: 'outdoor_adventure',
    price: 3000,
    price_unit: 'per_day',
    neighborhood: 'Downtown',
    language: 'en',
    accepts_trade: false,
    trade_description: null,
  },

  // --- Carlos ---
  {
    provider: 'carlos.m.seed@cruztrade.com',
    type: 'service',
    title: 'Yard cleanup, debris removal & hauling',
    image_url: IMG('1523741543316-beb7fc7023d8'), // yard / outdoor work
    description: 'Full yard cleanup service — leaf blowing, raking, bagging, and hauling away. Great for seasonal cleanups, storm debris, or getting your yard ready for guests. I bring my own truck and tools. Live Oak and surrounding neighborhoods. Quick turnaround, fair prices.',
    category: 'home_yard',
    price: 7500,
    price_unit: 'per_hour',
    neighborhood: 'Live Oak',
    language: 'both',
    accepts_trade: true,
    trade_description: 'Happy to trade for tech help or cooking',
  },
  {
    provider: 'carlos.m.seed@cruztrade.com',
    type: 'service',
    title: 'Tree & shrub pruning',
    image_url: IMG('1562159278-1253a58da141'), // tree / shrub pruning
    description: 'Proper pruning keeps your trees healthy and your yard looking great. I prune fruit trees, ornamental trees, hedges, and large shrubs. I know what cuts promote growth and what damages trees. Cleanup included. Serving Live Oak, Capitola, Soquel, and Aptos.',
    category: 'home_yard',
    price: 8500,
    price_unit: 'per_hour',
    neighborhood: 'Live Oak',
    language: 'both',
    accepts_trade: false,
    trade_description: null,
  },
  {
    provider: 'carlos.m.seed@cruztrade.com',
    type: 'tool_rental',
    title: 'Gas lawn mower — self-propelled, pick up in Live Oak',
    image_url: IMG('1559827260-dc66d52bef19'), // lawn mower
    description: 'Honda HRX 21-inch self-propelled gas mower. Sharp blade, runs great. Perfect for a one-time mow or if yours is in the shop. Pick up in Live Oak. Gas is on you. Leave it clean and full of gas when you return it.',
    category: 'garden_yard',
    price: 2500,
    price_unit: 'per_day',
    neighborhood: 'Live Oak',
    language: 'en',
    accepts_trade: false,
    trade_description: null,
  },
  {
    provider: 'carlos.m.seed@cruztrade.com',
    type: 'tool_rental',
    title: 'Cordless drill + bit kit (DeWalt 20V)',
    image_url: IMG('1530124566582-a618bc2615dc'), // cordless drill
    description: 'DeWalt 20V MAX cordless drill/driver with 2 batteries, charger, and a full bit set (drill bits, screwdriver bits, hole saws). Good for furniture assembly, hanging shelves, light construction. Pick up in Live Oak. Half-day rate available — just ask.',
    category: 'tools_equipment',
    price: 1200,
    price_unit: 'per_day',
    neighborhood: 'Live Oak',
    language: 'en',
    accepts_trade: false,
    trade_description: null,
  },

  // --- Dana ---
  {
    provider: 'dana.k.seed@cruztrade.com',
    type: 'service',
    title: 'Private yoga instruction — all levels',
    image_url: IMG('1544367567-0f2fcb009e0b'), // yoga pose
    description: 'RYT-500 certified yoga teacher with 10 years of experience. I offer private and semi-private sessions in your home, backyard, or at the beach. Hatha, Vinyasa, and Restorative styles. I tailor every class to your body and goals. First session includes a free 15-minute consultation.',
    category: 'wellness',
    price: 6000,
    price_unit: 'per_hour',
    neighborhood: 'Aptos',
    language: 'en',
    accepts_trade: true,
    trade_description: 'Trade for gardening, cooking, or tech help',
  },
  {
    provider: 'dana.k.seed@cruztrade.com',
    type: 'service',
    title: 'Swedish massage — in-home sessions, Aptos area',
    image_url: IMG('1519824145371-296894a0daa9'), // massage / spa
    description: 'Licensed massage therapist (10 years). I bring my table to your home for a relaxing, professional Swedish massage. Great for stress relief, muscle recovery, or just a treat. 60 or 90-minute sessions. South County only (Aptos, Capitola, Soquel, Santa Cruz).',
    category: 'wellness',
    price: 9000,
    price_unit: 'flat',
    neighborhood: 'Aptos',
    language: 'en',
    accepts_trade: false,
    trade_description: null,
  },
  {
    provider: 'dana.k.seed@cruztrade.com',
    type: 'service',
    title: 'Watercolor painting classes — beginners welcome',
    image_url: IMG('1541701494587-cb58502866ab'), // watercolor paints
    description: 'Fun, relaxed watercolor painting classes for adults and teens. No experience needed — I start from scratch and meet you where you are. We paint local scenes: the wharf, redwoods, the bay. Classes at my Aptos studio (up to 4 people) or I can come to you for group events.',
    category: 'lessons',
    price: 4500,
    price_unit: 'per_hour',
    neighborhood: 'Aptos',
    language: 'en',
    accepts_trade: true,
    trade_description: 'Trade for yoga, massage, garden help, or food',
  },
  {
    provider: 'dana.k.seed@cruztrade.com',
    type: 'tool_rental',
    title: 'Singer Heavy Duty sewing machine rental',
    image_url: IMG('1558618666-fcd25c85cd64'), // sewing machine
    description: 'Singer Heavy Duty 4452 sewing machine — handles denim, canvas, and multiple layers. Perfect for a weekend project, Halloween costume, or repairs. Comes with the manual and a starter kit of thread and needles. Pick up in Aptos.',
    category: 'tools_equipment',
    price: 2000,
    price_unit: 'per_day',
    neighborhood: 'Aptos',
    language: 'en',
    accepts_trade: false,
    trade_description: null,
  },

  // --- Tony ---
  {
    provider: 'tony.b.seed@cruztrade.com',
    type: 'service',
    title: 'Fence installation & repair',
    image_url: IMG('1499793983690-e29da59ef1c2'), // wood fence
    description: 'Wood or vinyl fence installation, repair, and staining. I\'ve built hundreds of fences in Santa Cruz County over 15 years. I handle everything: post holes, framing, boards, and hardware. Free estimates for jobs over $500. Serving Soquel, Capitola, Live Oak, and Aptos.',
    category: 'home_yard',
    price: 9000,
    price_unit: 'per_hour',
    neighborhood: 'Soquel',
    language: 'en',
    accepts_trade: false,
    trade_description: null,
  },
  {
    provider: 'tony.b.seed@cruztrade.com',
    type: 'service',
    title: 'Furniture assembly & light carpentry',
    image_url: IMG('1528892952291-009c663ce843'), // carpentry / woodworking
    description: 'IKEA, Wayfair, or custom — I assemble furniture fast and correctly. I also do small carpentry projects: shelving, closet organizers, TV mounts, baby gates. I bring all my own tools. Available evenings and weekends. Soquel base but will travel county-wide for larger jobs.',
    category: 'home_yard',
    price: 5500,
    price_unit: 'per_hour',
    neighborhood: 'Soquel',
    language: 'en',
    accepts_trade: true,
    trade_description: 'Trade for massage, cooking, or garden help',
  },
  {
    provider: 'tony.b.seed@cruztrade.com',
    type: 'tool_rental',
    title: 'Gas pressure washer — 3100 PSI',
    image_url: IMG('1580341289255-5b47c98a59dd'), // pressure washing deck
    description: 'Simpson 3100 PSI gas pressure washer. Excellent for driveways, decks, fences, siding, and patio furniture. Comes with 4 nozzle tips and 25 ft hose. You provide the gas. Pick up in Soquel. Available most weekdays and some weekends — message to check.',
    category: 'tools_equipment',
    price: 4500,
    price_unit: 'per_day',
    neighborhood: 'Soquel',
    language: 'en',
    accepts_trade: false,
    trade_description: null,
  },
  {
    provider: 'tony.b.seed@cruztrade.com',
    type: 'tool_rental',
    title: 'Wet tile saw — Dewalt 10"',
    image_url: IMG('1530124566582-a618bc2615dc'), // power saw / tools
    description: 'DeWalt 10-inch wet tile saw with diamond blade. Cuts ceramic, porcelain, and stone tile cleanly. Includes stand and extra blade. Ideal for bathroom/kitchen tile projects. Pick up in Soquel. Message for multi-day rates.',
    category: 'tools_equipment',
    price: 3500,
    price_unit: 'per_day',
    neighborhood: 'Soquel',
    language: 'en',
    accepts_trade: false,
    trade_description: null,
  },

  // --- Priya ---
  {
    provider: 'priya.s.seed@cruztrade.com',
    type: 'service',
    title: 'Laptop, phone & tablet repair',
    image_url: IMG('1488590528505-98d2b5aba04b'), // laptop on desk
    description: 'I repair Windows PCs, MacBooks, iPhones, and Android devices. Screen replacements, battery swaps, software issues, virus removal, slow computer tune-ups, data recovery. I come to you (Eastside SC and surrounding areas) or you can drop off at my place. Fast turnaround — usually same or next day.',
    category: 'tech_creative',
    price: 6000,
    price_unit: 'per_hour',
    neighborhood: 'Eastside',
    language: 'en',
    accepts_trade: true,
    trade_description: 'Trade for massage, yoga, cooking, or garden help',
  },
  {
    provider: 'priya.s.seed@cruztrade.com',
    type: 'service',
    title: 'Home WiFi setup & network troubleshooting',
    image_url: IMG('1517336714731-489689fd1ca8'), // router / wifi setup
    description: 'Bad WiFi signal? Devices not connecting? I set up routers, mesh networks, and smart home devices (Ring, Nest, Hue). I also help with printer setup, smart TV issues, and basic cybersecurity. Flat-rate pricing — no hourly surprises. Serving all of Santa Cruz city and nearby.',
    category: 'tech_creative',
    price: 7500,
    price_unit: 'flat',
    neighborhood: 'Eastside',
    language: 'en',
    accepts_trade: false,
    trade_description: null,
  },
  {
    provider: 'priya.s.seed@cruztrade.com',
    type: 'service',
    title: 'Reiki & energy healing sessions',
    image_url: IMG('1506126613408-eca07ce68773'), // hands / energy healing
    description: 'Certified Reiki Master (Usui lineage). I offer 60-minute in-home Reiki sessions for stress relief, anxiety, chronic pain, and overall wellbeing. I create a calm, grounded space wherever you are. I also combine with guided meditation and breathwork on request. Eastside Santa Cruz.',
    category: 'wellness',
    price: 7500,
    price_unit: 'flat',
    neighborhood: 'Eastside',
    language: 'en',
    accepts_trade: true,
    trade_description: 'Trade for tech help, cooking, or garden work',
  },

  // --- More care_errands services ---
  {
    provider: 'maria.g.seed@cruztrade.com',
    type: 'service',
    title: 'Childcare & babysitting — South County',
    image_url: IMG('1512621776951-a57141f2eefd'), // kids playing
    description: 'Experienced mother of three offering flexible childcare in Watsonville and surrounding areas. After-school pickup, homework help, meals, and engaging activities. Bilingual English/Spanish home environment. References available. Daily, weekly, or drop-in rates.',
    category: 'care_errands',
    price: 2000,
    price_unit: 'per_hour',
    neighborhood: 'Watsonville',
    language: 'both',
    accepts_trade: true,
    trade_description: 'Trade for garden help, cooking lessons, or tech support',
  },
  {
    provider: 'jake.t.seed@cruztrade.com',
    type: 'service',
    title: 'Dog walking & pet sitting — Westside',
    image_url: IMG('1551717743-49959800b1f6'), // dogs on leash
    description: 'Reliable dog walker and pet sitter on the Westside. Daily walks, drop-in visits, or overnight stays at your place. I have two dogs of my own and genuinely love animals. Great with high-energy breeds. Available most mornings and afternoons. Message me to set up a meet-and-greet.',
    category: 'care_errands',
    price: 2500,
    price_unit: 'per_hour',
    neighborhood: 'Westside',
    language: 'en',
    accepts_trade: false,
    trade_description: null,
  },
  {
    provider: 'priya.s.seed@cruztrade.com',
    type: 'service',
    title: 'Errand running & grocery shopping',
    image_url: IMG('1542838132-92c53300491e'), // grocery bags
    description: 'Need groceries, pharmacy pickup, post office runs, or other errands done? I cover all of Santa Cruz city and nearby neighborhoods. I use a reliable car and can handle multiple stops in one trip. Great for busy professionals, seniors, or anyone who just needs a hand. Flat rate per trip.',
    category: 'care_errands',
    price: 3500,
    price_unit: 'flat',
    neighborhood: 'Eastside',
    language: 'en',
    accepts_trade: true,
    trade_description: 'Trade for tech help, yoga, or garden work',
  },

  // --- More outdoor_adventure rentals ---
  {
    provider: 'dana.k.seed@cruztrade.com',
    type: 'tool_rental',
    title: 'Two kayaks + paddles — day or weekend rental',
    image_url: IMG('1526491109672-74740652b963'), // kayak on water
    description: 'Two sit-on-top kayaks perfect for Monterey Bay, the lagoon at Seacliff, or Capitola. Includes paddles and basic safety gear. Great for two people exploring the coast. Roof rack straps available if needed. Pick up in Aptos. Check availability before booking — popular on weekends.',
    category: 'outdoor_adventure',
    price: 5500,
    price_unit: 'per_day',
    neighborhood: 'Aptos',
    language: 'en',
    accepts_trade: false,
    trade_description: null,
  },
  {
    provider: 'jake.t.seed@cruztrade.com',
    type: 'tool_rental',
    title: 'Two mountain bikes — trail-ready, Westside pickup',
    image_url: IMG('1571188654248-7a89213915f7'), // mountain bikes
    description: 'Two 29er hardtail mountain bikes, medium and large frames. Dialed in and ready for Wilder Ranch, Demo Forest, or UCSC trails. Helmets included. Pick up on the Westside. Deposit required via Stripe — returned when bikes come back clean and undamaged.',
    category: 'outdoor_adventure',
    price: 4000,
    price_unit: 'per_day',
    neighborhood: 'Westside',
    language: 'en',
    accepts_trade: false,
    trade_description: null,
  },

  // --- party_events rentals ---
  {
    provider: 'tony.b.seed@cruztrade.com',
    type: 'tool_rental',
    title: '10x20 canopy tent + 8 folding tables & 40 chairs',
    image_url: IMG('1530103862676-de8c9debad1d'), // event tent setup
    description: 'Commercial-grade 10x20 pop-up canopy, 8 six-foot folding tables, and 40 folding chairs. Everything you need for a backyard party, graduation, quinceañera, or community event. Delivery and setup available within Soquel/Capitola/Aptos for extra fee. Pick up or we bring it to you.',
    category: 'party_events',
    price: 15000,
    price_unit: 'per_day',
    neighborhood: 'Soquel',
    language: 'en',
    accepts_trade: false,
    trade_description: null,
  },
  {
    provider: 'sofia.r.seed@cruztrade.com',
    type: 'tool_rental',
    title: 'Bluetooth PA system + wireless mic rental',
    image_url: IMG('1558403194-611308249627'), // speaker / PA system
    description: 'QSC K12 powered speaker (1000W) with a Bluetooth input and wireless handheld mic. Loud enough for 150 people outdoors. Great for outdoor parties, graduation speeches, band practice, or small events. Includes all cables and a mic stand. Pick up downtown SC.',
    category: 'party_events',
    price: 8000,
    price_unit: 'per_day',
    neighborhood: 'Downtown',
    language: 'en',
    accepts_trade: false,
    trade_description: null,
  },
  {
    provider: 'jake.t.seed@cruztrade.com',
    type: 'tool_rental',
    title: 'Portable projector + 100" screen — movie nights & events',
    image_url: IMG('1489599849927-2ee91cede3ba'), // outdoor movie
    description: 'Epson full HD projector (3500 lumens) with a 100-inch freestanding screen and a Bluetooth speaker. Perfect for backyard movie nights, presentations, or party entertainment. Works in partial daylight. Includes HDMI, extension cords, and setup instructions. Westside pickup.',
    category: 'party_events',
    price: 6500,
    price_unit: 'per_day',
    neighborhood: 'Westside',
    language: 'en',
    accepts_trade: false,
    trade_description: null,
  },

  // --- garden_yard rentals ---
  {
    provider: 'carlos.m.seed@cruztrade.com',
    type: 'tool_rental',
    title: 'Electric hedge trimmer & leaf blower combo',
    image_url: IMG('1416879595882-3373a0480b5b'), // hedge trimming
    description: 'Ryobi 40V cordless hedge trimmer (24 in blade) and matching leaf blower, both with charged batteries. Perfect for a weekend yard cleanup — trim the hedges and blow the clippings in one trip. Pick up in Live Oak. Return clean with batteries recharged.',
    category: 'garden_yard',
    price: 2000,
    price_unit: 'per_day',
    neighborhood: 'Live Oak',
    language: 'en',
    accepts_trade: false,
    trade_description: null,
  },
  {
    provider: 'tony.b.seed@cruztrade.com',
    type: 'tool_rental',
    title: 'Gas rototiller — veggie beds & new lawn prep',
    image_url: IMG('1416879595882-3373a0480b5b'), // garden tilling
    description: 'Troy-Bilt 21-inch rear-tine rototiller. Great for breaking new ground for a veggie garden, aerating established beds, or prepping a lawn. Self-propelled, easy to use. Pick up in Soquel. You provide the gas. Recommend booking 2 days to get the job done right.',
    category: 'garden_yard',
    price: 7500,
    price_unit: 'per_day',
    neighborhood: 'Soquel',
    language: 'en',
    accepts_trade: false,
    trade_description: null,
  },

  // --- vehicles rentals ---
  {
    provider: 'jake.t.seed@cruztrade.com',
    type: 'tool_rental',
    title: '5x8 enclosed cargo trailer rental',
    image_url: IMG('1519337265831-281ec6cc8514'), // cargo trailer
    description: 'U-Haul-style 5x8 enclosed cargo trailer — fits a full apartment\'s worth of furniture. Tow hitch required (2-inch ball, available to borrow). Perfect for moving furniture, hauling gear, or a Costco run. I\'ll show you how to hitch it safely. Pick up on the Westside.',
    category: 'vehicles',
    price: 5000,
    price_unit: 'per_day',
    neighborhood: 'Westside',
    language: 'en',
    accepts_trade: false,
    trade_description: null,
  },
  {
    provider: 'carlos.m.seed@cruztrade.com',
    type: 'tool_rental',
    title: 'Pickup truck rental — haul it yourself',
    image_url: IMG('1568605114967-8130f3a36994'), // pickup truck
    description: 'Full-size pickup truck (Ford F-150, 6.5 ft bed) available for self-drive hauling. Great for furniture, lumber, mulch, appliances, or a dump run. Insurance on you — must have valid license and be 25+. Gas returned full. Pick up in Live Oak. Half-day rate available.',
    category: 'vehicles',
    price: 7500,
    price_unit: 'per_day',
    neighborhood: 'Live Oak',
    language: 'en',
    accepts_trade: false,
    trade_description: null,
  },
];

// ---------------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------------

async function run() {
  console.log(`\nCruz Trade seed script ${DRY_RUN ? '(DRY RUN — no writes)' : ''}\n`);

  // Step 0: wipe dependent data then listings so re-seeds don't duplicate
  if (!DRY_RUN) {
    const ALL = '.neq';
    const wipe = async (table) => {
      process.stdout.write(`  Clearing ${table} … `);
      const { error } = await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000');
      if (error) throw error;
      console.log('done');
    };
    await wipe('reviews');
    await wipe('messages');
    await wipe('transactions');
    await wipe('listings');
  }
  console.log();

  // Step 1: create auth users + profiles
  const userIdByEmail = {};

  for (const provider of providers) {
    process.stdout.write(`  Provider ${provider.profile.full_name} … `);

    if (DRY_RUN) {
      console.log('skipped (dry run)');
      userIdByEmail[provider.email] = 'dry-run-id';
      continue;
    }

    // Try to create auth user
    const { data: created, error: createErr } = await supabase.auth.admin.createUser({
      email: provider.email,
      password: provider.password,
      email_confirm: true,
    });

    let userId;
    if (createErr) {
      if (createErr.message.includes('already been registered')) {
        // User exists — look them up
        const { data: { users }, error: listErr } = await supabase.auth.admin.listUsers();
        if (listErr) throw listErr;
        const existing = users.find(u => u.email === provider.email);
        if (!existing) throw new Error(`Could not find existing user for ${provider.email}`);
        userId = existing.id;
        process.stdout.write('exists, ');
      } else {
        throw createErr;
      }
    } else {
      userId = created.user.id;
      process.stdout.write('created, ');
    }

    userIdByEmail[provider.email] = userId;

    // Upsert profile
    const { error: profileErr } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        ...provider.profile,
        region: 'santa-cruz',
        is_verified: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' });

    if (profileErr) throw profileErr;
    console.log('profile upserted');
  }

  // Step 2: insert listings
  console.log('\n  Listings:\n');
  let inserted = 0;

  for (const listing of listings) {
    const userId = userIdByEmail[listing.provider];
    const { provider: _p, ...rest } = listing;

    process.stdout.write(`  [${rest.type === 'tool_rental' ? 'TOOL' : 'SVC '}] ${rest.title.slice(0, 55).padEnd(55)} … `);

    if (DRY_RUN) {
      console.log('skipped');
      continue;
    }

    const { error } = await supabase.from('listings').insert({
      user_id: userId,
      ...rest,
      region: 'santa-cruz',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.log(`ERROR: ${error.message}`);
    } else {
      console.log('OK');
      inserted++;
    }
  }

  console.log(`\n  Done. ${inserted}/${listings.length} listings inserted.\n`);
  console.log('  Provider login password: CruzTrade-seed-2026!\n');
}

run().catch(err => {
  console.error('\nSeed failed:', err.message);
  process.exit(1);
});
