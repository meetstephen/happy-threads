# Happiness Fashion World - Luxury Bespoke Couture

A luxury fashion-portfolio site for **Happiness Fashion World**, an Abakaliki-based Nigerian
fashion designer. Built to showcase her bespoke aso-ebi, owambe sets, bridal
couture, Ankara tailoring, kaftans, and men's agbada — and to convert visitors
into WhatsApp clients.

🌐 **Live:** https://happythreads.netlify.app

## Highlights

- **Custom monogram logo** — bronze-gradient "H" with thread-arc detail
- **Magazine-grade UI** — Playfair Display + Inter, cream/bronze/wine palette, smooth Framer Motion animations
- **Authentic Nigerian collection** — Aso-Ebi, Ankara, Kaftan & Boubou, Bridal, Corporate, Men's Tailoring — featuring African models throughout
- **🤖 AI Chatbot "Joy"** — answers pricing, lead time, location, fabric, and ordering questions; recommends specific designs; escalates to WhatsApp when needed
- **🪄 AI Style Finder** — 3-question quiz that recommends pieces from the collection
- **➕ Add Design panel** — passcode-protected admin form lets Happiness add new pieces from her phone (with auto-resized photo upload)
- **☁️ Real-time cloud sync (optional)** — when [Supabase is configured](./SUPABASE_SETUP.md), her additions appear live on every visitor's device, instantly
- **🔗 Shareable design URLs** — every design has its own deep link (`/?design=HF-001`); the Share button uses the native phone share sheet or copies to clipboard
- **📲 Installable PWA** — visitors can add the site to their phone home screen
- **📧 Newsletter signup** — captured via Netlify Forms, no backend needed
- **📱 QR code generator** — one-tap download to print on her business cards/shop sign
- **❓ FAQ section** — answers the top 8 questions automatically (reduces her support workload)
- **🟢 Filterable gallery** — All / New Arrivals / 6 categories / Favorites
- **🔖 Badges** — "New Arrival", "Just In" (custom uploads), "Stylist Pick"
- **Lightbox** with keyboard support and full design details
- **WhatsApp deep-linking** on every CTA — pre-fills polite messages with design name + reference ID to `+234 906 509 2129`
- **Floating WhatsApp button** + AI chat launcher
- **Light + Dark mode** with system preference detection
- **Mobile-first responsive** + Open Graph + Schema.org structured data (rich Google results)

## Tech Stack

- [Vite](https://vitejs.dev/) + React 18 + TypeScript
- [Tailwind CSS](https://tailwindcss.com/) (custom luxury palette + fonts)
- [Framer Motion](https://www.framer.com/motion/) for animations
- [Lucide React](https://lucide.dev/) for icons
- [Supabase](https://supabase.com/) for optional cloud sync (free tier)
- [QRCode](https://www.npmjs.com/package/qrcode) for the printable QR generator
- Hosted on [Netlify](https://www.netlify.com/) (free tier)
- Photography from Pexels (royalty-free, all swappable)

## Local Development

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build to dist/
npm run preview  # preview the production build locally
```

## Adding new designs (3 ways)

### 1. In-app admin panel — for Happiness, from her phone

1. Open the live site
2. Scroll to the footer and tap the small **🔑 key icon**
3. Enter passcode: `happy2026` (change it in `src/components/AddDesignPanel.tsx`)
4. Tap "Click to upload a photo" → choose a photo
5. Fill in name, category, optional description and tags
6. Tap **Save Design** ✨

If [Supabase cloud sync](./SUPABASE_SETUP.md) is configured (it should be), the design appears for **everyone** in real-time. If not, it's saved on her phone only.

### 2. Edit the catalog file — permanent, ships with the code

All designs live in `src/data/designs.ts`. Copy any block, change the values, push to GitHub. Netlify auto-redeploys in ~90 seconds.

### 3. Ask the developer

Send a WhatsApp with the photo and details — anyone maintaining the repo can add it permanently.

## Cloud sync setup (Supabase)

See **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** for a 10-minute step-by-step guide. Without it, the site works fine — designs added by Happiness are saved on her phone only.

## Folder structure

```
src/
├── App.tsx
├── main.tsx
├── index.css
├── vite-env.d.ts
├── components/
│   ├── About.tsx
│   ├── AddDesignPanel.tsx       👈 admin form (passcode + photo upload)
│   ├── Chatbot.tsx              👈 AI assistant "Joy"
│   ├── Collections.tsx
│   ├── Contact.tsx
│   ├── DesignCard.tsx
│   ├── Faq.tsx                  👈 8 FAQs in an accordion
│   ├── FloatingWhatsApp.tsx
│   ├── Footer.tsx
│   ├── Hero.tsx
│   ├── Lightbox.tsx             👈 deep-link aware
│   ├── Logo.tsx                 👈 brand monogram
│   ├── Marquee.tsx
│   ├── Navbar.tsx
│   ├── Newsletter.tsx           👈 Netlify Forms signup
│   ├── QrPanel.tsx              👈 QR code generator (in admin)
│   ├── Services.tsx
│   ├── StyleQuiz.tsx
│   └── Testimonials.tsx
├── context/
│   ├── CustomDesignsContext.tsx 👈 cloud + local design storage
│   ├── FavoritesContext.tsx
│   └── ThemeContext.tsx
├── data/
│   └── designs.ts               👈 static catalog (curated pieces)
├── lib/
│   └── supabase.ts              👈 cloud client (only active when env vars set)
├── services/
│   └── designsService.ts        👈 cloud read/write/upload + realtime
└── utils/
    ├── chatbot.ts               👈 AI bot intents
    ├── images.ts                👈 Pexels URL helper
    ├── imageResize.ts           👈 client-side photo resizer
    └── whatsapp.ts              👈 phone + message builders
public/
├── _redirects                   SPA fallback
├── favicon.svg                  brand mark
└── manifest.webmanifest         PWA config
netlify.toml                     Netlify build config
SUPABASE_SETUP.md                cloud-sync guide
```

## Environment variables

| Var | Required? | What it does |
|---|---|---|
| `VITE_SUPABASE_URL` | optional | Your Supabase project URL — enables cloud sync |
| `VITE_SUPABASE_ANON_KEY` | optional | Your Supabase anon public key |

Without them the site falls back to localStorage-only design storage. See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md).

---

Built with care for Happiness Fashion World, Abakaliki.
