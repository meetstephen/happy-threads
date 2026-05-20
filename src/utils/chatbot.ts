import type { Design } from '../data/designs';
import { buildWhatsAppUrl, generalEnquiryMessage } from './whatsapp';

export interface BotMessage {
  id: string;
  from: 'bot' | 'user';
  text: string;
  /** Optional quick-reply chips to render under the message. */
  chips?: string[];
  /** Optional CTA button — usually a WhatsApp link. */
  cta?: { label: string; href: string; external?: boolean };
  /** Optional design recommendation to render as a card. */
  design?: Design;
}

export const QUICK_REPLIES = [
  'Pricing',
  'Where are you located?',
  'How long does it take?',
  'Bridal info',
  'How do I order?',
  'Show me a design',
];

const greet = (): BotMessage => ({
  id: makeId(),
  from: 'bot',
  text:
    "Hi love! I'm Joy 💛 — Happiness's AI fashion assistant. Ask me about pricing, fabrics, lead time, or what's perfect for your event. How can I help today?",
  chips: QUICK_REPLIES,
});

export const initialMessages: BotMessage[] = [greet()];

function makeId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

interface Intent {
  patterns: RegExp[];
  reply: (input: string, designs: Design[]) => Omit<BotMessage, 'id' | 'from'>;
}

const intents: Intent[] = [
  {
    patterns: [/\b(hi|hello|hey|good\s*(morning|afternoon|evening)|howdy|holla)\b/],
    reply: () => ({
      text: "Hello, beautiful! 🌸 So glad you're here. What can I help you with — pricing, a specific event, or just browsing the collection?",
      chips: QUICK_REPLIES,
    }),
  },
  {
    patterns: [/\b(price|pricing|cost|how much|charge|rate|fee|budget)\b/],
    reply: () => ({
      text:
        "Pricing depends on the piece, fabric, and detailing:\n\n• Ready-to-wear & Ankara: ₦15,000 – ₦60,000\n• Aso-Ebi & owambe sets: ₦35,000 – ₦120,000\n• Bridal & couture gowns: ₦150,000 – ₦600,000+\n\nFor an exact quote, share your inspiration on WhatsApp and Happiness will price it for you.",
      cta: { label: 'Get a WhatsApp quote', href: buildWhatsAppUrl(generalEnquiryMessage()), external: true },
      chips: ['How long does it take?', 'How do I order?', 'Show me a design'],
    }),
  },
  {
    patterns: [/\b(location|where|address|based|abakaliki|ebonyi|studio|atelier|shop)\b/],
    reply: () => ({
      text:
        "We're based in Abakaliki, Ebonyi State, Nigeria 🇳🇬. Studio visits are by appointment only. We also ship nationwide via reliable couriers.",
      chips: ['Book an appointment', 'How do I order?', 'Pricing'],
      cta: {
        label: 'Book on WhatsApp',
        href: buildWhatsAppUrl('Hello Happiness! I would like to visit your atelier in Abakaliki for a fitting. When are you available?'),
        external: true,
      },
    }),
  },
  {
    patterns: [/\b(time|long|quick|how soon|lead time|deadline|when|delivery|fast|urgent|rush)\b/],
    reply: () => ({
      text:
        "Lead times depend on the piece:\n\n• Ready-to-wear & alterations: 5 – 10 days\n• Aso-Ebi sets & corporate co-ords: 2 – 3 weeks\n• Bridal couture: 4 – 8 weeks (3 fittings)\n\nRush orders are sometimes possible — DM Happiness on WhatsApp with your event date.",
      chips: ['Bridal info', 'Pricing', 'How do I order?'],
    }),
  },
  {
    patterns: [/\b(bridal|wedding|bride|gown|cathedral|veil|engagement)\b/],
    reply: (_, designs) => {
      const bride = designs.find((d) => d.category === 'Bridal') ?? designs[0];
      return {
        text:
          "Bridal is our heart 💍. The full experience includes a design consultation, fabric sourcing, and 3 fittings over 4 – 8 weeks. We craft cathedral gowns, traditional engagement looks, and reception dresses. Here's one of our pieces — tap it to view, or request a custom design on WhatsApp.",
        design: bride,
        cta: {
          label: 'Book bridal consultation',
          href: buildWhatsAppUrl(
            'Hello Happiness! I am getting married soon and would love to book a bridal consultation. Could we discuss available dates?'
          ),
          external: true,
        },
        chips: ['Pricing', 'How long does it take?', 'How do I order?'],
      };
    },
  },
  {
    patterns: [/\b(aso[\s-]?ebi|owambe|gele|wedding\s*guest|family\s*uniform)\b/],
    reply: (_, designs) => {
      const piece = designs.find((d) => d.category === 'Aso-Ebi & Owambe') ?? designs[0];
      return {
        text:
          "We love an owambe! 🎉 Aso-ebi sets typically take 2 – 3 weeks once fabric arrives. We sew everything from corseted blouses to full ball-gown wrappers and matching gele. Here's a recent set:",
        design: piece,
        chips: ['Pricing', 'How do I order?', 'How long does it take?'],
      };
    },
  },
  {
    patterns: [/\b(ankara|print|fabric pattern|wax\s*print)\b/],
    reply: (_, designs) => {
      const piece = designs.find((d) => d.category === 'Ankara') ?? designs[0];
      return {
        text:
          "Ankara is bold, joyful, and so versatile. We tailor everything from co-ord power suits to flared dresses and skirt-blouse sets. You can bring your own fabric or we'll source one for you.",
        design: piece,
        chips: ['Show me a design', 'Pricing', 'How do I order?'],
      };
    },
  },
  {
    patterns: [/\b(kaftan|boubou|abaya|modest|loose|flowy)\b/],
    reply: (_, designs) => {
      const piece = designs.find((d) => d.category === 'Kaftan & Boubou') ?? designs[0];
      return {
        text:
          "Kaftans and boubous are perfect for comfort with elegance. We do beaded yokes, embroidered necklines, and bell sleeves in any colour you want.",
        design: piece,
        chips: ['Pricing', 'Show me a design', 'How do I order?'],
      };
    },
  },
  {
    patterns: [/\b(corporate|office|work|suit|blazer|professional|boardroom)\b/],
    reply: (_, designs) => {
      const piece = designs.find((d) => d.category === 'Corporate') ?? designs[0];
      return {
        text:
          "For the modern professional — co-ord blazers, tailored trousers, sheath dresses with Ankara trims, all made-to-measure for your exact fit.",
        design: piece,
        chips: ['Pricing', 'How long does it take?'],
      };
    },
  },
  {
    patterns: [/\b(men|man|guy|husband|groom|agbada|kaftan\s*for\s*men|trouser|shirt|suit\s*for\s*men)\b/],
    reply: (_, designs) => {
      const piece = designs.find((d) => d.category === "Men's Tailoring") ?? designs[0];
      return {
        text:
          "Yes! We tailor men's pieces too — agbada, kaftans, trousers, dress shirts, and slim-cut suits. All fully made-to-measure.",
        design: piece,
        chips: ['Pricing', 'How long does it take?', 'How do I order?'],
      };
    },
  },
  {
    patterns: [/\b(measurement|measure|size|fitting|fit)\b/],
    reply: () => ({
      text:
        "We're a made-to-measure house, so your fit is exact. Here's how it works:\n\n1️⃣ For Abakaliki clients — visit the studio for measurements.\n2️⃣ For nationwide clients — Happiness will guide you over a WhatsApp video call (it takes ~10 mins).\n3️⃣ Final fitting confirms perfection before delivery.",
      chips: ['Book an appointment', 'How do I order?', 'How long does it take?'],
    }),
  },
  {
    patterns: [/\b(fabric|material|silk|lace|aso[\s-]?oke|brocade|chiffon|taffeta|cotton|satin|velvet)\b/],
    reply: () => ({
      text:
        "We work with: Ankara, Aso-Oke, French lace, silk, satin, chiffon, taffeta, organza, brocade, and velvet. We can source any specific fabric or work with one you provide.",
      chips: ['Pricing', 'How do I order?'],
    }),
  },
  {
    patterns: [/\b(payment|pay|deposit|bank|transfer|opay|card)\b/],
    reply: () => ({
      text:
        "We accept bank transfer, Opay, and cash. A 50% deposit secures your slot, with the balance due before pickup or shipping.",
      chips: ['How do I order?', 'Pricing'],
    }),
  },
  {
    patterns: [/\b(deliver|ship|courier|nationwide|abuja|lagos|enugu|port[\s-]?harcourt)\b/],
    reply: () => ({
      text:
        "We ship nationwide via GIG Logistics, DHL Domestic, and other reliable couriers. Delivery is usually 2 – 4 days within Nigeria. Shipping is paid by the client based on weight and destination.",
      chips: ['How do I order?', 'Pricing'],
    }),
  },
  {
    patterns: [/\b(order|book|begin|start|commission|how\s+(do|to))\b/],
    reply: () => ({
      text:
        "Easy! Here's how:\n\n1️⃣ Browse the collection above and save what you love (heart icon).\n2️⃣ Tap 'Order on WhatsApp' on any design — your message is pre-filled.\n3️⃣ Happiness will reply with availability, final price, and next steps.\n4️⃣ Pay deposit, take measurements, then we sew and deliver.",
      cta: { label: 'Start on WhatsApp', href: buildWhatsAppUrl(generalEnquiryMessage()), external: true },
      chips: ['Pricing', 'How long does it take?'],
    }),
  },
  {
    patterns: [/\b(show|see|recommend|suggest|design|piece|outfit|something)\b/],
    reply: (_, designs) => {
      const featured = designs.find((d) => d.featured) ?? designs[0];
      return {
        text:
          "Here's one I love right now. Tap 'View Collection' below to see everything, or take our quick AI Style Quiz to get personalized picks.",
        design: featured,
        chips: ['View Collection', 'Take Style Quiz', 'How do I order?'],
      };
    },
  },
  {
    patterns: [/\b(thank|thanks|thx|appreciate|bless)\b/],
    reply: () => ({
      text: "It's my pleasure 💛 Anything else I can help with? Or feel free to message Happiness on WhatsApp directly.",
      cta: { label: 'Chat with Happiness', href: buildWhatsAppUrl(generalEnquiryMessage()), external: true },
    }),
  },
  {
    patterns: [/\b(bye|goodbye|see\s*you|talk\s*later|cheerio)\b/],
    reply: () => ({
      text: "Take care, gorgeous! 🌸 Come back anytime. And don't forget to follow Happiness on Instagram for new pieces.",
    }),
  },
];

export function generateReply(input: string, designs: Design[]): BotMessage {
  const text = input.trim().toLowerCase();
  for (const intent of intents) {
    if (intent.patterns.some((p) => p.test(text))) {
      const r = intent.reply(text, designs);
      return { id: makeId(), from: 'bot', ...r };
    }
  }
  return {
    id: makeId(),
    from: 'bot',
    text:
      "Hmm, I want to make sure I get this right. Would you like to chat directly with Happiness on WhatsApp? She'll have a perfect answer 💛",
    cta: { label: 'Chat with Happiness', href: buildWhatsAppUrl(generalEnquiryMessage()), external: true },
    chips: QUICK_REPLIES,
  };
}

export function userMessage(text: string): BotMessage {
  return { id: makeId(), from: 'user', text };
}
