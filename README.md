# Happiness Fashion — Bespoke Naija Couture

A luxury fashion-portfolio site for **Happiness**, an Abakaliki-based Nigerian
fashion designer. Built to showcase her bespoke aso-ebi, owambe sets, bridal
couture, Ankara tailoring, kaftans, and men's agbada — and to convert visitors
into WhatsApp clients.

🌐 **Live:** https://happythreads.netlify.app

## Highlights

- **Custom monogram logo** — bronze-gradient "H" with thread-arc detail
- **Magazine-grade UI** — Playfair Display + Inter, cream/bronze/wine palette, smooth Framer Motion animations
- **Authentic Nigerian collection** — categories include Aso-Ebi, Ankara, Kaftan & Boubou, Bridal, Corporate, and Men's Tailoring
- **🤖 AI Chatbot "Joy"** — smart pattern-matching assistant that answers pricing, lead time, fabric, location and order questions, recommends designs, and escalates to WhatsApp
- **🪄 AI Style Finder** — 3-question quiz that recommends pieces from the collection
- **➕ Add Design panel** — passcode-protected admin form lets Happiness add new pieces (with auto-resized photo upload) directly from her phone — saved to browser storage and merged with the catalog
- **Filterable gallery** — All / New Arrivals / 6 categories / Favorites
- **NEW Arrival badges** + "Just In" badge for designs Happiness adds herself
- **Lightbox** with keyboard support and full design details
- **WhatsApp deep-linking** on every CTA — pre-fills polite messages with design name + reference ID to `+234 906 509 2129`
- **Floating WhatsApp button** + AI chat launcher
- **Light + Dark mode** with system preference detection
- **Mobile-first responsive** + Open Graph / SEO so the link looks beautiful on WhatsApp

## Tech Stack

- [Vite](https://vitejs.dev/) + React 18 + TypeScript
- [Tailwind CSS](https://tailwindcss.com/) (custom luxury palette + fonts)
- [Framer Motion](https://www.framer.com/motion/) for animations
- [Lucide React](https://lucide.dev/) for icons
- Hosted on [Netlify](https://www.netlify.com/) (free tier)
- Photography from Pexels (royalty-free, swappable per design)

## Local Development

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build to dist/
npm run preview  # preview the production build locally
```

## How to add new designs (Happiness — this is for you)

You have **three** ways to add a new piece you've just made:

### Option 1 — In-app Add Design panel (easiest, do it from your phone)

1. Open https://happythreads.netlify.app
2. Scroll to the very bottom (footer)
3. Click the small **🔑 key icon** at the right end of the footer
4. Enter the passcode: `happy2026`
5. Tap **"Click to upload a photo"** → choose a photo of the dress
6. Fill in name, pick a category, optional description and tags
7. Tap **Save Design** ✨

The new design appears immediately on the site (with a "Just In" badge) and is saved in your browser. **Tip:** if you want this design visible to *every* visitor (not just on your browser), use Option 2 below.

### Option 2 — Edit the catalog file (permanent, visible to everyone)

All designs live in **one file**: `src/data/designs.ts`.

1. Upload your photo to **[Cloudinary](https://cloudinary.com/)** (free) or any image host. Get the direct URL.
2. Open `src/data/designs.ts`.
3. Copy any existing design block and paste it at the top of the array.
4. Change `id`, `name`, `image` URL, `description`, `category`, `tags`, and set `isNew: true` and `addedOn: '2026-05-20'` (today's date).
5. Push to GitHub. Netlify auto-redeploys in ~90 seconds and the design is live for everyone.

### Option 3 — Ask the developer

Just send me (or whoever maintains the site) a WhatsApp message with the photo and design info. They can add it permanently.

## How to update the AI chatbot's answers

The chatbot's knowledge lives in `src/utils/chatbot.ts`. Each "intent" has a list of regex patterns and a reply. To add a new FAQ:

```ts
{
  patterns: [/\b(your|trigger|words)\b/],
  reply: () => ({
    text: 'Your answer here...',
    chips: ['Suggested follow-up', 'Another option'],
  }),
},
```

## Updating the WhatsApp number

Edit `src/utils/whatsapp.ts` — the constants `WHATSAPP_PHONE` and `WHATSAPP_DISPLAY` are the single source of truth used everywhere on the site.

## Folder structure

```
src/
├── App.tsx
├── main.tsx
├── index.css
├── components/
│   ├── About.tsx
│   ├── AddDesignPanel.tsx       👈 admin form for new designs
│   ├── Chatbot.tsx              👈 AI assistant "Joy"
│   ├── Collections.tsx
│   ├── Contact.tsx
│   ├── DesignCard.tsx
│   ├── FloatingWhatsApp.tsx
│   ├── Footer.tsx
│   ├── Hero.tsx
│   ├── Lightbox.tsx
│   ├── Logo.tsx                 👈 brand monogram
│   ├── Marquee.tsx
│   ├── Navbar.tsx
│   ├── Services.tsx
│   ├── StyleQuiz.tsx
│   └── Testimonials.tsx
├── context/
│   ├── CustomDesignsContext.tsx 👈 localStorage-backed user-added designs
│   ├── FavoritesContext.tsx
│   └── ThemeContext.tsx
├── data/
│   └── designs.ts               👈 edit this to add/remove designs permanently
└── utils/
    ├── chatbot.ts               👈 AI bot intents & replies
    ├── images.ts                👈 Pexels image URL helper
    ├── imageResize.ts           👈 client-side photo resizer
    └── whatsapp.ts              👈 phone number + message builders
public/
├── _redirects                   SPA fallback for Netlify
└── favicon.svg                  brand mark
netlify.toml                     Netlify build config
```

---

Built with care for Happiness Fashion, Abakaliki.
