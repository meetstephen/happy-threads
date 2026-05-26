# Happiness Fashion World - Luxury Bespoke Couture

A luxury fashion-portfolio site for **Happiness Fashion World**, an Abakaliki-based Nigerian
fashion designer. Built to showcase her bespoke aso-ebi, owambe sets, bridal
couture, Ankara tailoring, kaftans, and men's agbada -- and to convert visitors
into WhatsApp clients.

🌐 **Live:** https://happythreads.netlify.app

## Highlights

- **Custom monogram logo** -- bronze-gradient "H" with thread-arc detail
- **Magazine-grade UI** -- Playfair Display + Inter, cream/bronze/wine palette, smooth Framer Motion animations
- **Authentic Nigerian collection** -- Aso-Ebi, Ankara, Kaftan & Boubou, Bridal, Corporate, Men's Tailoring -- featuring African models throughout
- **🤖 AI Chatbot "Joy"** -- answers pricing, lead time, location, fabric, and ordering questions; recommends specific designs; escalates to WhatsApp when needed
- **🪄 AI Style Finder** -- 3-question quiz that recommends pieces from the collection
- **➕ Add Design panel** -- passcode-protected admin form lets Happiness add new pieces from her phone (with auto-resized photo upload)
- **☁️ Real-time cloud sync (optional)** -- when [Supabase is configured](./SUPABASE_SETUP.md), her additions appear live on every visitor's device, instantly
- **🔗 Shareable design URLs** -- every design has its own deep link (`/?design=HF-001`); the Share button uses the native phone share sheet or copies to clipboard
- **📲 Installable PWA** -- visitors can add the site to their phone home screen
- **📧 Newsletter signup** -- captured via Netlify Forms, no backend needed
- **📱 QR code generator** -- one-tap download to print on her business cards/shop sign
- **❓ FAQ section** -- answers the top 8 questions automatically (reduces her support workload)
- **🟢 Filterable gallery** -- All / New Arrivals / 6 categories / Favorites
- **🔖 Badges** -- "New Arrival", "Just In" (custom uploads), "Stylist Pick"
- **Lightbox** with keyboard support and full design details
- **WhatsApp deep-linking** on every CTA -- pre-fills polite messages with design name + reference ID to `+234 906 509 2129`
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

## Owner's Guide (for Happiness)

Everything below can be done **entirely from your phone**. The admin panel is
designed mobile-first so you can manage the site from anywhere -- no computer
needed.

---

### Accessing admin mode

The admin panel is hidden from visitors. To open it:

1. Open your site URL with `/#admin` at the end:
   **https://happythreads.netlify.app/#admin**
2. Bookmark this URL on your phone home screen for quick access.

There is no visible button on the public site -- only someone who knows the
`/#admin` URL can reach it.

---

### Signing in (two modes)

The site supports two authentication modes depending on setup:

#### Mode A: Local passcode (default, no Supabase)

If Supabase is NOT configured, you see a simple passcode screen:

- The passcode is read from the `VITE_ADMIN_PASSCODE` environment variable
- If `VITE_ADMIN_PASSCODE` is not set, the passcode screen will show a message
  directing you to configure Supabase or set the env var
- Enter the passcode and tap "Unlock"
- To change the passcode: update the `VITE_ADMIN_PASSCODE` variable in your
  Netlify environment settings and redeploy

#### Mode B: Cloud email/password (with Supabase)

If Supabase IS configured (recommended), you see an email/password sign-in:

1. First time only: tap **"Create your atelier account"**
2. Enter the admin email (must match `VITE_ADMIN_EMAIL` in your hosting env vars)
3. Choose a strong password (e.g. `Happiness2026!`)
4. Tap **"Create account"**
5. You are now signed in and the site remembers you

Future visits: you are already signed in -- the admin panel opens immediately.

> **Your initial password** is whatever you chose during account creation.
> If you forget it, your developer can reset it from the Supabase dashboard
> (see [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for details).

---

### The Edit Mode banner

Once signed in, you will see a **gold banner** at the top of the site that says:

> "Edit Mode -- tap any text or image to change it"

This means you can now:
- Tap any text with a pencil icon to edit it inline
- Tap any image with a camera icon to replace it
- Use the "Add Design" button to open the admin panel

Visitors never see this banner -- it only appears when you are signed in.

---

### Uploading new design photos

1. Open `/#admin` on your phone (you should already be signed in)
2. You will see the **Add Design** tab (it opens by default)
3. Tap **"Click to upload a photo"** -- your phone's camera/gallery opens
4. Choose a photo from your gallery OR take a new photo with your camera
5. Fill in the details:
   - **Name** -- e.g. "Emerald Aso-Oke Ensemble"
   - **Category** -- pick from the dropdown (Aso-Ebi & Owambe, Ankara, Bridal, etc.)
   - **Description** (optional) -- a sentence about the design
   - **Tags** (optional) -- comma-separated words, e.g. "lace, green, wedding"
6. Tap **Save Design**

The photo is automatically resized for fast loading. If cloud sync is configured,
the new design appears on the site for ALL visitors instantly -- no refresh needed.

---

### Editing an existing design

1. While in Edit Mode (signed in), browse your designs in the Collections gallery
2. Each design card shows a small **pencil icon** in the corner
3. Tap the pencil -- the admin panel opens pre-filled with that design's info
4. Change anything: name, category, description, tags
5. To **replace the photo**: tap the image area and choose a new photo
6. Tap **Save Changes**

---

### Removing / deleting a design

1. While in Edit Mode, open the admin panel
2. Scroll down -- you will see a list of your custom designs
3. Tap the **trash icon** next to the design you want to remove
4. Confirm the deletion

The design disappears from the site for all visitors immediately.

---

### Replacing a design photo

1. Open the design for editing (tap the pencil icon on the card)
2. Tap the current photo in the edit form
3. Choose a new photo from your gallery or camera
4. Tap **Save Changes**

The old photo is replaced everywhere on the site.

---

### Editing site text and content (inline editing)

When you are signed in (gold banner visible), you can edit almost any text on
the site directly:

1. Look for text that shows a small **pencil icon** when you are in Edit Mode
2. Tap the pencil icon next to the text
3. An inline editor appears -- type your new text
4. Tap the **checkmark** to save, or **X** to cancel
5. To revert to the original default text, tap the **reset arrow**

This works for headings, descriptions, section text, and more -- all from your
phone. Changes are saved to the cloud and appear for all visitors instantly.

---

### Replacing site images (inline editing)

Similar to text, images on the site can be swapped:

1. In Edit Mode, look for images with a **camera icon** overlay
2. Tap the camera icon
3. Choose a new image from your phone
4. The image uploads and replaces the old one for all visitors

---

### Renaming category labels

1. Open `/#admin` on your phone
2. Tap the **"Categories"** tab at the top of the admin panel
3. You will see all your category names listed
4. Tap any category name to rename it
5. Type the new name and save

This changes how the category appears in the filter buttons and design cards
across the whole site.

---

### Generating QR codes

1. Open `/#admin` on your phone
2. Tap the **"QR"** tab at the top of the admin panel
3. A QR code is generated that links to your site
4. Tap **Download** to save it to your phone
5. Print it on business cards, shop signs, flyers, or fabric tags

Anyone who scans the QR code is taken directly to your site.

---

### Tips for phone-based management

- **Bookmark `/#admin`** on your phone home screen -- one tap to manage your site
- **Take photos in good light** -- the site auto-resizes them, but good lighting
  makes your designs look their best
- **Use landscape orientation** for full outfit photos when possible
- **Cloud sync means instant updates** -- your changes appear for everyone the
  moment you tap Save
- **You can manage from anywhere** -- on the bus, at the market, in your shop --
  all you need is internet and your phone

---

### For developers: other ways to add designs

#### Edit the catalog file directly

All built-in designs live in `src/data/designs.ts`. Copy any block, change the
values, push to GitHub. Netlify auto-redeploys in ~90 seconds.

#### Ask the developer

Send a WhatsApp with the photo and details -- anyone maintaining the repo can
add designs permanently to the code.

## Cloud sync setup (Supabase)

See **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** for a 10-minute step-by-step guide. Without it, the site works fine -- designs added by Happiness are saved on her phone only.

## Folder structure

```
src/
├── App.tsx
├── main.tsx
├── index.css
├── vite-env.d.ts
├── components/
│   ├── About.tsx
│   ├── AddDesignPanel.tsx       admin form (passcode + photo upload)
│   ├── BookingCTA.tsx           "Book Your Bespoke Experience" section
│   ├── Chatbot.tsx              AI assistant "Joy"
│   ├── Collections.tsx
│   ├── Contact.tsx
│   ├── Craftsmanship.tsx        atelier process timeline
│   ├── DesignCard.tsx
│   ├── EditableImage.tsx        inline image swap (admin only)
│   ├── EditableText.tsx         inline text editing (admin only)
│   ├── Faq.tsx                  8 FAQs in an accordion
│   ├── FloatingWhatsApp.tsx
│   ├── Footer.tsx
│   ├── Hero.tsx
│   ├── Lightbox.tsx             deep-link aware
│   ├── Logo.tsx                 brand monogram
│   ├── Marquee.tsx
│   ├── Navbar.tsx
│   ├── Newsletter.tsx           Netlify Forms signup
│   ├── QrPanel.tsx              QR code generator (in admin)
│   ├── Services.tsx
│   ├── SizeGuide.tsx
│   ├── StyleQuiz.tsx
│   └── Testimonials.tsx
├── context/
│   ├── CustomDesignsContext.tsx  cloud + local design storage
│   ├── FavoritesContext.tsx
│   ├── SiteContentContext.tsx   editable site text/images storage
│   └── ThemeContext.tsx
├── data/
│   └── designs.ts               static catalog (curated pieces)
├── lib/
│   ├── auth.ts                  admin auth hook (Supabase gated)
│   └── supabase.ts              cloud client (only active when env vars set)
├── services/
│   ├── designsService.ts        cloud read/write/upload + realtime
│   └── geminiChat.ts            AI chatbot service
└── utils/
    ├── categoryLabel.ts         category label overrides
    ├── chatbot.ts               AI bot intents
    ├── constants.ts             shared constants
    ├── images.ts                Pexels URL helper
    ├── imageResize.ts           client-side photo resizer
    ├── scroll.ts                smooth scroll utilities
    └── whatsapp.ts              phone + message builders
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
| `VITE_SUPABASE_URL` | optional | Your Supabase project URL -- enables cloud sync |
| `VITE_SUPABASE_ANON_KEY` | optional | Your Supabase anon public key |
| `VITE_ADMIN_EMAIL` | optional | Admin email address -- gates who can sign in to manage the site |
| `GEMINI_API_KEY` | optional | Google AI Studio API key (server-side, powers the Joy chatbot via Netlify Edge Function) |
| `VITE_ADMIN_PASSCODE` | optional | Fallback admin passcode when Supabase is not configured |
| `VITE_CONTACT_EMAIL` | optional | Public contact email shown on site (defaults to hello@happinessfashionworld.com) |

Without the Supabase vars the site falls back to localStorage-only design storage and
the VITE_ADMIN_PASSCODE for authentication. Without GEMINI_API_KEY the chatbot
falls back to the built-in pattern-matching engine. See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for
full setup instructions.

---

Built with care for Happiness Fashion World, Abakaliki.
