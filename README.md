# Happiness Fashion World â€” Luxury Bespoke Couture

A luxury fashion-portfolio website for **Happiness Fashion World**, an
Abakaliki-based Nigerian fashion designer. It showcases her bespoke aso-ebi,
owambe sets, bridal couture, Ankara tailoring, kaftans, and men's agbada â€” and
turns visitors into WhatsApp clients.

> **New to the site? Read the [OWNER'S MANUAL](./OWNER_MANUAL.md) first.**
> It is a plain-English, step-by-step guide to running everything from your phone.

ðŸŒ **Live:** https://happinessfashion.netlify.app

---

## What the site does

- **Magazine-grade luxury design** â€” Playfair Display + Inter, cream/bronze/wine
  palette, smooth Framer Motion animations, light + dark mode.
- **Authentic Nigerian collection** â€” Aso-Ebi, Ankara, Kaftan & Boubou, Bridal,
  Corporate, and Men's Tailoring, all featuring African models.
- **ðŸ¤– AI stylist "Joy"** â€” a warm, human chatbot (powered by Google Gemini 2.5
  Flash) that answers pricing, lead-time, location, fabric, and ordering
  questions, recommends specific designs, and hands off to WhatsApp.
- **ðŸª„ AI Style Finder** â€” a 3-question quiz that recommends pieces from the
  collection (includes the owner's own uploaded designs too).
- **ðŸ› ï¸ Full admin dashboard** â€” a mobile-first control centre with 12 sections
  (see below). The owner runs the entire site from her phone.
- **â˜ï¸ Real-time cloud sync** â€” when [Supabase is configured](./SUPABASE_SETUP.md),
  edits and new designs appear live on every visitor's device instantly.
- **ðŸ”— Shareable design links**, **ðŸ“² installable PWA**, **ðŸ“§ newsletter capture**,
  **ðŸ“± QR-code generator**, **â“ FAQ accordion**, **filterable gallery**, and a
  keyboard/swipe-friendly **lightbox**.
- **WhatsApp deep-linking** on every CTA, pre-filling polite messages to
  **+234 906 509 2129**.
- **Security-hardened** â€” the Gemini API key is proxied server-side via a Netlify
  Edge Function (never exposed in the browser), strict Content-Security-Policy and
  other headers, input sanitisation, image validation, and admin rate-limiting.
- **Mobile-first** everywhere â€” bottom navigation bar, large touch targets,
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
| **Lookbook** | Take/upload photos, batch-publish, arrange display order, edit designs, and rename categories |
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

Set these in **Netlify â†’ Site configuration â†’ Environment variables**. The site
works without them (falling back to local-only storage and the pattern-matching
chatbot), but all the cloud features need them.

| Variable | Required? | What it does |
|---|---|---|
| `VITE_SUPABASE_URL` | recommended | Supabase project URL â€” enables cloud sync |
| `VITE_SUPABASE_ANON_KEY` | recommended | Supabase anon public key |
| `VITE_ADMIN_EMAIL` | recommended | The single email allowed to sign in as admin |
| `GEMINI_API_KEY` | optional | Google Gemini key for the "Joy" AI stylist. **No `VITE_` prefix** â€” it stays server-side in the Edge Function and is never sent to the browser |
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
â”œâ”€â”€ App.tsx                       app shell + routing of modals/admin
â”œâ”€â”€ main.tsx                      providers (theme, favorites, designs, content)
â”œâ”€â”€ index.css
â”œâ”€â”€ components/
â”‚   â”œâ”€â”€ admin/                    ðŸ‘ˆ the admin dashboard (12 sections)
â”‚   â”‚   â”œâ”€â”€ AdminDashboard.tsx     shell: auth gate + sidebar/bottom-nav
â”‚   â”‚   â”œâ”€â”€ AdminHome.tsx          welcome + quick links
â”‚   â”‚   â”œâ”€â”€ AdminImages.tsx        site image manager
â”‚   â”‚   â”œâ”€â”€ AdminSiteCopy.tsx      text content editor
â”‚   â”‚   â”œâ”€â”€ AdminLookbook.tsx      design add / edit / batch / remove
â”‚   â”‚   â”œâ”€â”€ AdminFeatured.tsx      hero + featured designs
â”‚   â”‚   â”œâ”€â”€ AdminAnnouncements.tsx top announcement bar
â”‚   â”‚   â”œâ”€â”€ AdminTestimonials.tsx  testimonials manager
â”‚   â”‚   â”œâ”€â”€ AdminAnalytics.tsx     visitor insights
â”‚   â”‚   â”œâ”€â”€ AdminTemplates.tsx     WhatsApp message templates
â”‚   â”‚   â”œâ”€â”€ AdminBookings.tsx      bookings tracker
â”‚   â”‚   â”œâ”€â”€ AdminCustomers.tsx     customer directory
â”‚   â”‚   â”œâ”€â”€ AdminSite.tsx          brand stats + QR generator
â”‚   â”‚   â””â”€â”€ AnnouncementBar.tsx    public-facing announcement bar
â”‚   â”œâ”€â”€ About.tsx                 the designer's story
â”‚   â”œâ”€â”€ BookingCTA.tsx            "Begin your bespoke journey" CTA
â”‚   â”œâ”€â”€ Chatbot.tsx               AI assistant "Joy"
â”‚   â”œâ”€â”€ Collections.tsx           filterable gallery
â”‚   â”œâ”€â”€ Contact.tsx
â”‚   â”œâ”€â”€ Craftsmanship.tsx         atelier process timeline
â”‚   â”œâ”€â”€ DesignCard.tsx            editable design tile
â”‚   â”œâ”€â”€ EditableImage.tsx         inline image swap (admin only)
â”‚   â”œâ”€â”€ EditableText.tsx          inline text editing (admin only)
â”‚   â”œâ”€â”€ Faq.tsx
â”‚   â”œâ”€â”€ FloatingWhatsApp.tsx
â”‚   â”œâ”€â”€ Footer.tsx                holds the secret 5-tap admin gesture
â”‚   â”œâ”€â”€ Hero.tsx
â”‚   â”œâ”€â”€ Lightbox.tsx              deep-link + swipe aware
â”‚   â”œâ”€â”€ Logo.tsx                  brand monogram
â”‚   â”œâ”€â”€ Marquee.tsx
â”‚   â”œâ”€â”€ MobileBottomNav.tsx       mobile bottom navigation
â”‚   â”œâ”€â”€ Navbar.tsx
â”‚   â”œâ”€â”€ Newsletter.tsx            Supabase + mailto fallback signup
â”‚   â”œâ”€â”€ QrPanel.tsx               QR code generator (used by AdminSite)
â”‚   â”œâ”€â”€ ScrollToTop.tsx
â”‚   â”œâ”€â”€ Services.tsx
â”‚   â”œâ”€â”€ SizeGuide.tsx
â”‚   â”œâ”€â”€ StyleQuiz.tsx
â”‚   â”œâ”€â”€ Testimonials.tsx
â”‚   â””â”€â”€ WhatWeSew.tsx
â”œâ”€â”€ context/
â”‚   â”œâ”€â”€ CustomDesignsContext.tsx  cloud + local design storage
â”‚   â”œâ”€â”€ FavoritesContext.tsx
â”‚   â”œâ”€â”€ SiteContentContext.tsx    editable site text/images storage
â”‚   â””â”€â”€ ThemeContext.tsx
â”œâ”€â”€ data/designs.ts               static catalog (curated pieces)
â”œâ”€â”€ lib/
â”‚   â”œâ”€â”€ auth.ts                   admin auth hook (Supabase gated)
â”‚   â””â”€â”€ supabase.ts               cloud client (active when env vars set)
â”œâ”€â”€ services/
â”‚   â”œâ”€â”€ designsService.ts         cloud read/write/upload + realtime
â”‚   â”œâ”€â”€ newsletterService.ts      newsletter signup + mailto fallback
â”‚   â””â”€â”€ geminiChat.ts             AI chatbot service (calls /api/gemini)
â””â”€â”€ utils/
    â”œâ”€â”€ categoryLabel.ts          category label overrides
    â”œâ”€â”€ chatbot.ts                pattern-matching fallback bot
    â”œâ”€â”€ constants.ts              shared constants
    â”œâ”€â”€ images.ts                 Pexels URL helper
    â”œâ”€â”€ imageResize.ts            client-side photo resizer
    â”œâ”€â”€ sanitize.ts               input sanitisation + image validation
    â”œâ”€â”€ scroll.ts                 smooth scroll utilities
    â””â”€â”€ whatsapp.ts               phone + message builders
netlify/
â””â”€â”€ edge-functions/
    â””â”€â”€ gemini-proxy.ts           server-side Gemini key proxy (/api/gemini)
public/
â”œâ”€â”€ _redirects                    SPA fallback
â”œâ”€â”€ favicon.svg                   brand mark
â””â”€â”€ manifest.webmanifest          PWA config
netlify.toml                      Netlify build + security headers
SUPABASE_SETUP.md                 cloud-sync setup guide
OWNER_MANUAL.md                   plain-English guide for the owner
```

---

Built with care for **Happiness Fashion World**, Abakaliki, Nigeria.

