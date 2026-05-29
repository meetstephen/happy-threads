# Happiness Fashion World — Luxury Bespoke Couture

A luxury fashion-portfolio website for **Happiness Fashion World**, an
Abakaliki-based Nigerian fashion designer. It showcases her bespoke aso-ebi,
owambe sets, bridal couture, Ankara tailoring, kaftans, and men's agbada — and
turns visitors into WhatsApp clients.

> **New to the site? Read the [OWNER'S MANUAL](./OWNER_MANUAL.md) first.**
> It is a plain-English, step-by-step guide to running everything from your phone.

🌐 **Live:** https://happythreads.netlify.app

---

## What the site does

- **Magazine-grade luxury design** — Playfair Display + Inter, cream/bronze/wine
  palette, smooth Framer Motion animations, light + dark mode.
- **Authentic Nigerian collection** — Aso-Ebi, Ankara, Kaftan & Boubou, Bridal,
  Corporate, and Men's Tailoring, all featuring African models.
- **🤖 AI stylist "Joy"** — a warm, human chatbot (powered by Google Gemini 2.5
  Flash) that answers pricing, lead-time, location, fabric, and ordering
  questions, recommends specific designs, and hands off to WhatsApp.
- **🪄 AI Style Finder** — a 3-question quiz that recommends pieces from the
  collection (includes the owner's own uploaded designs too).
- **🛠️ Full admin dashboard** — a mobile-first control centre with 12 sections
  (see below). The owner runs the entire site from her phone.
- **☁️ Real-time cloud sync** — when [Supabase is configured](./SUPABASE_SETUP.md),
  edits and new designs appear live on every visitor's device instantly.
- **🔗 Shareable design links**, **📲 installable PWA**, **📧 newsletter capture**,
  **📱 QR-code generator**, **❓ FAQ accordion**, **filterable gallery**, and a
  keyboard/swipe-friendly **lightbox**.
- **WhatsApp deep-linking** on every CTA, pre-filling polite messages to
  **+234 906 509 2129**.
- **Security-hardened** — the Gemini API key is proxied server-side via a Netlify
  Edge Function (never exposed in the browser), strict Content-Security-Policy and
  other headers, input sanitisation, image validation, and admin rate-limiting.
- **Mobile-first** everywhere — bottom navigation bar, large touch targets,
  scroll-to-top, and an in-page announcement bar.

---

## The Admin Dashboard

The admin area is a hidden, password-protected control centre. It is opened by
visiting `/#admin` **or** by the secret gesture (tap the copyright line in the
footer 5 times quickly). It is organised into 12 sections:

| Section | What it manages |
|---|---|
| **Home** | Welcome screen + quick links to every tool |
| **Images** | Upload / replace / remove any image across the site |
| **Site Copy** | Edit headlines, taglines, the About story, and section text |
| **Lookbook** | Add, edit, batch-upload, and remove designs; rename categories |
| **Featured** | Set the homepage hero image and choose featured designs |
| **Announcements** | Toggle and edit the top announcement bar |
| **Testimonials** | Add, edit, and curate customer testimonials |
| **Analytics** | Visitor counts, top designs, and section engagement |
| **Templates** | Reusable WhatsApp message snippets (copy in one tap) |
| **Bookings** | Track fittings, consultations, and deliveries |
| **Customers** | Client profiles, measurements, and preferences |
| **Site** | Brand stats + printable QR-code generator |

Navigation is a sidebar on desktop and a bottom tab bar (+ a "More" sheet) on
mobile. A prominent **"Back to site"** button returns to the public site.

Full step-by-step instructions for every section are in the
**[OWNER'S MANUAL](./OWNER_MANUAL.md)**.

---

## Tech Stack

- [Vite](https://vitejs.dev/) + React 18 + TypeScript
- [Tailwind CSS](https://tailwindcss.com/) (custom luxury palette + fonts)
- [Framer Motion](https://www.framer.com/motion/) for animations
- [Lucide React](https://lucide.dev/) for icons
- [Supabase](https://supabase.com/) for optional cloud sync, auth, and storage
- [Google Gemini](https://ai.google.dev/) (2.5 Flash) for the AI stylist, proxied
  through a Netlify Edge Function
- [QRCode](https://www.npmjs.com/package/qrcode) for the printable QR generator
- Hosted on [Netlify](https://www.netlify.com/) (free tier)
- Photography from Pexels (royalty-free, all swappable from the admin panel)

---

## Local Development

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build to dist/
npm run preview  # preview the production build locally
```

---

## Environment variables

Set these in **Netlify → Site configuration → Environment variables**. The site
works without them (falling back to local-only storage and the pattern-matching
chatbot), but all the cloud features need them.

| Variable | Required? | What it does |
|---|---|---|
| `VITE_SUPABASE_URL` | recommended | Supabase project URL — enables cloud sync |
| `VITE_SUPABASE_ANON_KEY` | recommended | Supabase anon public key |
| `VITE_ADMIN_EMAIL` | recommended | The single email allowed to sign in as admin |
| `GEMINI_API_KEY` | optional | Google Gemini key for the "Joy" AI stylist. **No `VITE_` prefix** — it stays server-side in the Edge Function and is never sent to the browser |
| `VITE_ADMIN_PASSCODE` | optional | Fallback passcode for admin access when Supabase auth is not configured |
| `VITE_CONTACT_EMAIL` | optional | Public contact email shown on the site |

> **Why `GEMINI_API_KEY` has no `VITE_` prefix:** any variable starting with
> `VITE_` is bundled into the public JavaScript. The Gemini key must stay secret,
> so it is read only by the server-side Edge Function at `/api/gemini`.

See **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** for the full 12-minute cloud setup.

---

## Folder structure

```
src/
├── App.tsx                       app shell + routing of modals/admin
├── main.tsx                      providers (theme, favorites, designs, content)
├── index.css
├── components/
│   ├── admin/                    👈 the admin dashboard (12 sections)
│   │   ├── AdminDashboard.tsx     shell: auth gate + sidebar/bottom-nav
│   │   ├── AdminHome.tsx          welcome + quick links
│   │   ├── AdminImages.tsx        site image manager
│   │   ├── AdminSiteCopy.tsx      text content editor
│   │   ├── AdminLookbook.tsx      design add / edit / batch / remove
│   │   ├── AdminFeatured.tsx      hero + featured designs
│   │   ├── AdminAnnouncements.tsx top announcement bar
│   │   ├── AdminTestimonials.tsx  testimonials manager
│   │   ├── AdminAnalytics.tsx     visitor insights
│   │   ├── AdminTemplates.tsx     WhatsApp message templates
│   │   ├── AdminBookings.tsx      bookings tracker
│   │   ├── AdminCustomers.tsx     customer directory
│   │   ├── AdminSite.tsx          brand stats + QR generator
│   │   └── AnnouncementBar.tsx    public-facing announcement bar
│   ├── About.tsx                 the designer's story
│   ├── BookingCTA.tsx            "Begin your bespoke journey" CTA
│   ├── Chatbot.tsx               AI assistant "Joy"
│   ├── Collections.tsx           filterable gallery
│   ├── Contact.tsx
│   ├── Craftsmanship.tsx         atelier process timeline
│   ├── DesignCard.tsx            editable design tile
│   ├── EditableImage.tsx         inline image swap (admin only)
│   ├── EditableText.tsx          inline text editing (admin only)
│   ├── Faq.tsx
│   ├── FloatingWhatsApp.tsx
│   ├── Footer.tsx                holds the secret 5-tap admin gesture
│   ├── Hero.tsx
│   ├── Lightbox.tsx              deep-link + swipe aware
│   ├── Logo.tsx                  brand monogram
│   ├── Marquee.tsx
│   ├── MobileBottomNav.tsx       mobile bottom navigation
│   ├── Navbar.tsx
│   ├── Newsletter.tsx            Supabase + mailto fallback signup
│   ├── QrPanel.tsx               QR code generator (used by AdminSite)
│   ├── ScrollToTop.tsx
│   ├── Services.tsx
│   ├── SizeGuide.tsx
│   ├── StyleQuiz.tsx
│   ├── Testimonials.tsx
│   └── WhatWeSew.tsx
├── context/
│   ├── CustomDesignsContext.tsx  cloud + local design storage
│   ├── FavoritesContext.tsx
│   ├── SiteContentContext.tsx    editable site text/images storage
│   └── ThemeContext.tsx
├── data/designs.ts               static catalog (curated pieces)
├── lib/
│   ├── auth.ts                   admin auth hook (Supabase gated)
│   └── supabase.ts               cloud client (active when env vars set)
├── services/
│   ├── designsService.ts         cloud read/write/upload + realtime
│   ├── newsletterService.ts      newsletter signup + mailto fallback
│   └── geminiChat.ts             AI chatbot service (calls /api/gemini)
└── utils/
    ├── categoryLabel.ts          category label overrides
    ├── chatbot.ts                pattern-matching fallback bot
    ├── constants.ts              shared constants
    ├── images.ts                 Pexels URL helper
    ├── imageResize.ts            client-side photo resizer
    ├── sanitize.ts               input sanitisation + image validation
    ├── scroll.ts                 smooth scroll utilities
    └── whatsapp.ts               phone + message builders
netlify/
└── edge-functions/
    └── gemini-proxy.ts           server-side Gemini key proxy (/api/gemini)
public/
├── _redirects                    SPA fallback
├── favicon.svg                   brand mark
└── manifest.webmanifest          PWA config
netlify.toml                      Netlify build + security headers
SUPABASE_SETUP.md                 cloud-sync setup guide
OWNER_MANUAL.md                   plain-English guide for the owner
```

---

Built with care for **Happiness Fashion World**, Abakaliki, Nigeria.
