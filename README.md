# Happiness Fashion — Bespoke Couture Portfolio

A luxury fashion-portfolio site for **Happiness**, a Nigerian fashion designer.
Built to showcase her bespoke women's couture, bridal, ready-to-wear and
men's tailoring — and to convert visitors into WhatsApp clients.

[![Deploys on Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start)

## Highlights

- **Magazine-grade UI** — Playfair Display + Inter, cream/bronze/wine palette, smooth Framer Motion animations
- **AI Style Finder** — 3-question quiz that recommends pieces from the collection (runs entirely client-side, zero API cost)
- **Filterable gallery** by category + a Favorites filter (saved in `localStorage`)
- **Lightbox** with keyboard support and full design details
- **WhatsApp deep-linking** — every "Order" button pre-fills a polite, structured WhatsApp message to `+234 906 509 2129` containing the design name + reference ID
- **Floating WhatsApp button** that appears after scroll
- **Light + Dark mode** with system preference detection
- **Fully responsive** — mobile-first since most clients arrive from WhatsApp links
- **SEO + Open Graph** — beautiful link previews when shared on WhatsApp/Instagram/Facebook

## Tech Stack

- [Vite](https://vitejs.dev/) + React 18 + TypeScript
- [Tailwind CSS](https://tailwindcss.com/) (custom luxury palette + fonts)
- [Framer Motion](https://www.framer.com/motion/) for animations
- [Lucide React](https://lucide.dev/) for icons
- Hosted on [Netlify](https://www.netlify.com/) (free tier)

## Local Development

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build to dist/
npm run preview  # preview the production build locally
```

## Deploying to Netlify (step-by-step, no prior experience needed)

> Goal: a live URL like `https://happiness-fashion.netlify.app` that Happiness can paste into WhatsApp/Instagram bio. **100% free**.

### Option A — Connect GitHub (recommended, auto-deploys on every push)

1. Push this repository to GitHub (already done if you see this README on GitHub).
2. Go to **https://app.netlify.com/signup** and sign up with your GitHub account (free).
3. After signing in, click **"Add new site" → "Import an existing project"**.
4. Choose **"Deploy with GitHub"**, then authorize Netlify.
5. Pick the **`happy-threads`** repository from the list.
6. Netlify will auto-detect the build settings from `netlify.toml`. They should already read:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Node version:** `20`
   Leave them as-is.
7. Click **"Deploy site"**. First build takes ~1–2 minutes.
8. When the build finishes, Netlify gives you a random URL like
   `https://luminous-puffin-1234.netlify.app`. Click **"Site settings" → "Change site name"** and set it to `happiness-fashion` (or anything available) — the URL becomes `https://happiness-fashion.netlify.app`.
9. **Done.** Every future `git push` to `main` redeploys automatically.

### Option B — Drag & drop (zero git, fastest one-off)

1. Run `npm run build` locally — this creates the `dist/` folder.
2. Go to **https://app.netlify.com/drop** while signed in.
3. Drag the entire `dist` folder onto the page.
4. Netlify hosts it instantly and gives you a public URL.
5. The downside: every update needs a fresh drag-and-drop. Option A is better long term.

### Custom domain (optional, ~$10/year)

If Happiness later wants `happinessfashion.com`:
1. Buy the domain on Namecheap, GoDaddy, or any registrar.
2. In Netlify: **Site settings → Domain management → Add custom domain**.
3. Follow Netlify's DNS instructions (or transfer the domain to Netlify DNS — easiest).
4. Netlify auto-issues a free SSL certificate.

## How to update the designs (Happiness — this is for you)

All designs live in **one file**: `src/data/designs.ts`.

For each design you can edit:
- `name` — the design title
- `image` — a URL to the photo (use [Cloudinary](https://cloudinary.com/), Imgur, or Google Drive direct-link)
- `description` — what makes the piece special
- `tags` — fabric, technique, etc.
- `occasions`, `vibes`, `colorMood` — these power the AI Style Finder so the right pieces get recommended

To add a new design, copy any block in the file and change the values. Save, push to GitHub, and Netlify auto-redeploys in under 2 minutes.

## Updating WhatsApp number

Edit `src/utils/whatsapp.ts` — the constants `WHATSAPP_PHONE` and `WHATSAPP_DISPLAY` are the single source of truth used everywhere on the site.

## Folder structure

```
src/
├── App.tsx
├── main.tsx
├── index.css
├── components/        # All UI sections
├── context/           # Theme + Favorites (localStorage-backed)
├── data/designs.ts    # 👈 Edit this to add/remove designs
└── utils/whatsapp.ts  # 👈 Edit this to change phone number
public/
├── _redirects         # SPA fallback for Netlify
└── favicon.svg
netlify.toml           # Netlify build config
```

---

Built with care.
