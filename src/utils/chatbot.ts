import type { Design } from '../data/designs';
import { buildWhatsAppUrl, generalEnquiryMessage } from './whatsapp';

export interface BotMessage {
  id: string;
  from: 'bot' | 'user';
  text: string;
  /** Optional quick-reply chips to render under the message. */
  chips?: string[];
  /** Optional CTA button - usually a WhatsApp link. */
  cta?: { label: string; href: string; external?: boolean };
  /** Optional design recommendation to render as a card. */
  design?: Design;
}

export const QUICK_REPLIES = [
  'What can you make for me?',
  'Pricing & timeline',
  'Where are you?',
  'Bridal dreams',
  'How to order',
  'Show me something beautiful',
];

const GREETINGS = [
  "Welcome, darling! \u2728 I'm Joy \u2014 your personal style concierge here at Happiness Fashion World. Think of me as that friend who always knows what you should wear. Whether you're dreaming of the perfect bridal look, planning your owambe entrance, or just want something that makes you feel like the queen you are \u2014 I'm here to help. Nno, welcome! \uD83D\uDC9B What's on your mind today, love?",
  "Ndewo! \uD83D\uDC9B Welcome to Happiness Fashion World, beautiful! I'm Joy, your style bestie. Whether na bridal gown, aso-ebi for owambe, or corporate slay you dey find \u2014 I go help you find am. No stress at all, darling! What can I do for you today?",
  "Hey there, gorgeous! \u2728 I'm Joy and I'm so happy you stopped by Happiness Fashion World. E kaabo! Think of this as your personal fashion consultation \u2014 no appointment needed. What style dream can I help you with today? \uD83D\uDC9B",
];

const greet = (): BotMessage => ({
  id: makeId(),
  from: 'bot',
  text: GREETINGS[Math.floor(Math.random() * GREETINGS.length)],
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
  // Greeting
  {
    patterns: [/\b(hi|hello|hey|good\s*(morning|afternoon|evening)|howdy|holla|ekaro|bawo ni|kedu)\b/],
    reply: () => ({
      text: "Oh hello, beautiful soul! \uD83C\uDF3A So lovely to see you here. I'm Joy, and this is your space to dream, explore, and discover something that was made just for you. What brings you to our little corner of the fashion world today?",
      chips: QUICK_REPLIES,
    }),
  },
  // Pricing
  {
    patterns: [/\b(price|pricing|cost|how much|charge|rate|fee|budget|expensive|affordable)\b/],
    reply: () => ({
      text:
        "Every piece we create is as unique as the woman wearing it, darling. Let me give you a sense of what to expect:\n\n\u2728 Ready-to-wear & Ankara pieces: \u20A615,000 \u2013 \u20A660,000\n\uD83D\uDC51 Aso-Ebi & owambe sets: \u20A635,000 \u2013 \u20A6120,000\n\uD83D\uDC8D Bridal & couture gowns: \u20A6150,000 \u2013 \u20A6600,000+\n\nBut honestly, love, until we know your dream \u2014 the fabric you want to float in, the beadwork that catches the light just right \u2014 your quote is a conversation away. Share your vision with Happiness on WhatsApp and she'll craft the perfect proposal for you.",
      cta: { label: 'Get your personal quote \uD83D\uDC8C', href: buildWhatsAppUrl(generalEnquiryMessage()), external: true },
      chips: ['How long does it take?', 'How to order', 'Show me something beautiful'],
    }),
  },
  // Location
  {
    patterns: [/\b(location|where|address|based|abakaliki|ebonyi|studio|atelier|shop|come|visit)\b/],
    reply: () => ({
      text:
        "Our little haven of creativity is nestled in the heart of Abakaliki, Ebonyi State, Nigeria \uD83C\uDDF3\uD83C\uDDEC. It's where the magic happens \u2014 bolts of fabric stacked like dreams, the hum of sewing machines, and Happiness herself bringing sketches to life.\n\nStudio visits are by appointment, so we can give you our full, undivided attention. And if you're not in Abakaliki? No wahala, love \u2014 we ship beautifully packaged pieces nationwide.",
      chips: ['Book an appointment', 'How to order', 'Pricing & timeline'],
      cta: {
        label: 'Book your studio visit \u2728',
        href: buildWhatsAppUrl('Hello Happiness Fashion World! I would love to visit your atelier in Abakaliki for a fitting. When are you available?'),
        external: true,
      },
    }),
  },
  // Timeline / Lead time / Rush
  {
    patterns: [/\b(time|long|quick|how soon|lead time|deadline|when|delivery|fast|urgent|rush|hurry|last[\s-]?minute)\b/],
    reply: () => ({
      text:
        "Great things take a little time, darling, but we always make it worth the wait:\n\n\u23F3 Ready-to-wear & alterations: 5 \u2013 10 days\n\uD83C\uDF1F Aso-Ebi sets & corporate co-ords: 2 \u2013 3 weeks\n\uD83D\uDC70 Bridal couture: 4 \u2013 8 weeks (with 3 dreamy fittings)\n\nGot a deadline breathing down your neck? Don't panic, sweetheart. Rush orders are sometimes possible \u2014 Happiness has pulled off miracles before. Just share your event date on WhatsApp and we'll move heaven and earth for you.",
      chips: ['Bridal dreams', 'Pricing & timeline', 'How to order'],
      cta: { label: 'Share your event date', href: buildWhatsAppUrl('Hello! I have an event coming up soon and need something beautiful made. Can we discuss a rush timeline?'), external: true },
    }),
  },
  // Bridal
  {
    patterns: [/\b(bridal|wedding|bride|gown|cathedral|veil|engagement|white\s*wedding|igba\s*nkwu)\b/],
    reply: (_, designs) => {
      const bride = designs.find((d) => d.category === 'Bridal') ?? designs[0];
      return {
        text:
          "Oh, you're getting married! \uD83D\uDC8D Congratulations, darling! This is one of the most beautiful journeys, and we'd be honored to dress you for it.\n\nOur bridal experience is pure luxury \u2014 a private design consultation where we sketch YOUR vision, hand-selected fabrics that make you gasp, and three fittings over 4\u20138 weeks until every seam is perfect. Whether you're dreaming of a cathedral train, a sleek reception dress, or a stunning traditional igba nkwu look \u2014 Happiness will make you cry happy tears in the mirror.\n\nHere's one of our bridal pieces to inspire you:",
        design: bride,
        cta: {
          label: 'Book your bridal consultation \uD83D\uDC70',
          href: buildWhatsAppUrl(
            'Hello Happiness Fashion World! I am getting married and would love to book a bridal consultation. I want to feel absolutely breathtaking on my special day!'
          ),
          external: true,
        },
        chips: ['Pricing & timeline', 'How long does it take?', 'How to order'],
      };
    },
  },
  // Aso-Ebi / Owambe
  {
    patterns: [/\b(aso[\s-]?ebi|owambe|gele|wedding\s*guest|family\s*uniform)\b/],
    reply: (_, designs) => {
      const piece = designs.find((d) => d.category === 'Aso-Ebi & Owambe') ?? designs[0];
      return {
        text:
          "Owambe! \uD83C\uDF89 Now you're speaking my language, darling! There's nothing like that feeling of stepping into a hall and turning every single head.\n\nWe craft everything from corseted blouses that snatch your waist, to flowing wrappers with that perfect drape, matching gele that crowns you like royalty. Aso-ebi sets typically take 2\u20133 weeks once your fabric arrives \u2014 and honey, we make sure you're the one everyone is whispering about.\n\nHere's a recent piece to set the mood:",
        design: piece,
        chips: ['Pricing & timeline', 'How to order', 'How long does it take?'],
      };
    },
  },
  // Ankara
  {
    patterns: [/\b(ankara|print|fabric pattern|wax\s*print)\b/],
    reply: (_, designs) => {
      const piece = designs.find((d) => d.category === 'Ankara') ?? designs[0];
      return {
        text:
          "Ankara, the fabric of joy! \uD83C\uDFA8 Bold, vibrant, unapologetically beautiful \u2014 just like you, darling. We tailor everything from co-ord power suits that command the boardroom, to flirty flared dresses for Sunday brunch, to structured peplum sets for when you want to own the room.\n\nBring your own fabric or let us source the perfect print for you \u2014 we know all the best fabric markets.",
        design: piece,
        chips: ['Show me something beautiful', 'Pricing & timeline', 'How to order'],
      };
    },
  },
  // Kaftan / Boubou
  {
    patterns: [/\b(kaftan|boubou|abaya|modest|loose|flowy)\b/],
    reply: (_, designs) => {
      const piece = designs.find((d) => d.category === 'Kaftan & Boubou') ?? designs[0];
      return {
        text:
          "Kaftans and boubous are where comfort meets absolute elegance, love. \u2728 Imagine flowing fabric that moves like water, with a beaded yoke or embroidered neckline catching the light as you walk in.\n\nWe do bell sleeves, butterfly cuts, and everything in between \u2014 in any colour that sings to your soul.",
        design: piece,
        chips: ['Pricing & timeline', 'Show me something beautiful', 'How to order'],
      };
    },
  },
  // Corporate
  {
    patterns: [/\b(corporate|office|work|suit|blazer|professional|boardroom)\b/],
    reply: (_, designs) => {
      const piece = designs.find((d) => d.category === 'Corporate') ?? designs[0];
      return {
        text:
          "For the woman \u2014 or man \u2014 who walks into every room like they own it. \uD83D\uDCBC Our corporate pieces blend sharp tailoring with subtle cultural flair: think co-ord blazers with Ankara lining, structured dashiki-inspired shirts, and sheath dresses that mean business.\n\nAll made-to-measure, because power dressing should fit like it was born on your body.",
        design: piece,
        chips: ['Pricing & timeline', 'How long does it take?'],
      };
    },
  },
  // Men's
  {
    patterns: [/\b(men|man|guy|husband|groom|agbada|kaftan\s*for\s*men|trouser|shirt|suit\s*for\s*men)\b/],
    reply: (_, designs) => {
      const piece = designs.find((d) => d.category === "Men's Tailoring") ?? designs[0];
      return {
        text:
          "Of course, darling! The men deserve to look magnificent too. \uD83D\uDC51 We tailor agbada that command rooms, senator kaftans with the cleanest lines, fitted trousers, dress shirts, and slim-cut suits.\n\nAll fully made-to-measure \u2014 because a well-dressed man is a powerful man. Whether it's your husband, brother, or father, we'll make him the finest gentleman in any gathering.",
        design: piece,
        chips: ['Pricing & timeline', 'How long does it take?', 'How to order'],
      };
    },
  },
  // Measurements
  {
    patterns: [/\b(measurement|measure|size|fitting|fit)\b/],
    reply: () => ({
      text:
        "We're a made-to-measure house, love \u2014 meaning every single stitch is drafted from YOUR body. No guessing, no \"close enough.\" Here's how we make it seamless:\n\n1\uFE0F\u20E3 For our Abakaliki beauties \u2014 come to the studio! We'll have you measured with a cup of tea.\n2\uFE0F\u20E3 For our nationwide queens \u2014 Happiness will guide you through a quick WhatsApp video call (10 minutes, painless, darling!).\n3\uFE0F\u20E3 A final fitting confirms everything is perfection before your piece comes home to you.",
      chips: ['Book an appointment', 'How to order', 'How long does it take?'],
    }),
  },
  // Fabric
  {
    patterns: [/\b(fabric|material|silk|lace|aso[\s-]?oke|brocade|chiffon|taffeta|cotton|satin|velvet|organza)\b/],
    reply: () => ({
      text:
        "Oh, let's talk fabrics, darling \u2014 one of my favourite topics! \uD83E\uDDF5 We work with the most beautiful materials:\n\nAnkara \u2022 Aso-Oke \u2022 French Lace \u2022 Silk \u2022 Satin \u2022 Chiffon \u2022 Taffeta \u2022 Organza \u2022 Brocade \u2022 Velvet \u2022 Crepe \u2022 Sequin mesh\n\nYou can bring your own fabric (we love seeing what inspires you!) or let Happiness source the perfect one. She knows every fabric market from Aba to Lagos and always finds the good-good quality.",
      chips: ['Pricing & timeline', 'How to order'],
    }),
  },
  // Payment
  {
    patterns: [/\b(payment|pay|deposit|bank|transfer|opay|card|installment)\b/],
    reply: () => ({
      text:
        "We keep it simple and flexible, love:\n\n\uD83D\uDCB3 Bank transfer, Opay, or cash \u2014 whatever works for you.\n\uD83D\uDCB0 A 50% deposit secures your slot and materials.\n\u2705 Balance is due before pickup or shipping.\n\nFor bridal and high-value pieces, we can discuss flexible payment plans. The goal is to make your dream piece stress-free from start to finish.",
      chips: ['How to order', 'Pricing & timeline'],
    }),
  },
  // Delivery
  {
    patterns: [/\b(deliver|ship|courier|nationwide|abuja|lagos|enugu|port[\s-]?harcourt|send)\b/],
    reply: () => ({
      text:
        "We deliver nationwide, darling! \uD83D\uDE9A Your piece arrives beautifully wrapped and ready to wear:\n\n\u2022 GIG Logistics, DHL Domestic, and other trusted couriers\n\u2022 Usually 2\u20134 days within Nigeria\n\u2022 Shipping is based on weight and destination\n\nEvery piece is packaged with love \u2014 tissue paper, garment bag, the works. Because the unboxing should feel like Christmas morning. \uD83C\uDF81",
      chips: ['How to order', 'Pricing & timeline'],
    }),
  },
  // How to order
  {
    patterns: [/\b(order|book|begin|start|commission|how\s+(do|to))\b/],
    reply: () => ({
      text:
        "It's so easy, sweetheart! Here's your path to something beautiful:\n\n1\uFE0F\u20E3 Browse our collection above and heart the pieces that make you feel something.\n2\uFE0F\u20E3 Tap 'Order on WhatsApp' on any design \u2014 your message is already crafted.\n3\uFE0F\u20E3 Happiness will reply with availability, your personal quote, and next steps.\n4\uFE0F\u20E3 Pay deposit, share measurements, and then... we create magic. \u2728\n\nOr just say hi on WhatsApp with your vision \u2014 even a vague dream is enough. We'll shape it into reality together.",
      cta: { label: 'Start your style journey \uD83D\uDC8C', href: buildWhatsAppUrl(generalEnquiryMessage()), external: true },
      chips: ['Pricing & timeline', 'How long does it take?'],
    }),
  },
  // Custom / Bespoke
  {
    patterns: [/\b(custom|bespoke|my own|my design|my style|bring my|unique|one[\s-]?of[\s-]?a[\s-]?kind|special request)\b/],
    reply: () => ({
      text:
        "Oh darling, YES! \uD83C\uDF1F Custom is what we live for. Bring us your Pinterest board, a sketch on a napkin, a screenshot from Instagram, or just a feeling \u2014 \"I want to look like a goddess at my sister's wedding\" \u2014 and Happiness will translate it into fabric and thread.\n\nEvery custom piece starts with a conversation and ends with you twirling in front of the mirror. No two pieces are ever the same, because no two women are.\n\nReady to create something the world has never seen before?",
      cta: { label: 'Share your vision \u2728', href: buildWhatsAppUrl('Hello! I have a custom design idea I would love to bring to life. Can we discuss my vision?'), external: true },
      chips: ['Pricing & timeline', 'How long does it take?', 'Show me something beautiful'],
    }),
  },
  // Children's clothing
  {
    patterns: [/\b(children|kids|baby|little one|daughter|son|child|junior|mini[\s-]?me)\b/],
    reply: () => ({
      text:
        "The little ones! \uD83E\uDE79 How adorable! Yes, darling, we dress the whole family. From matching mother-daughter Ankara sets to little agbada for your prince charming, to flower girl dresses that steal the show.\n\nChildren's pieces are made with the same attention to detail, just with extra room for them to play, dance, and be the little stars they are. Send us their measurements and your vision!",
      cta: { label: 'Enquire about kids\' styles', href: buildWhatsAppUrl('Hello! I would love to order outfits for my children. Can we discuss styles and measurements?'), external: true },
      chips: ['Pricing & timeline', 'How long does it take?'],
    }),
  },
  // Trending styles
  {
    patterns: [/\b(trend|trending|popular|in style|what's hot|latest|new arrival|what's new)\b/],
    reply: (_, designs) => {
      const newest = designs.filter((d) => d.isNew).sort((a, b) => (b.addedOn ?? '').localeCompare(a.addedOn ?? ''))[0] ?? designs[0];
      return {
        text:
          "Oh, you want to know what's turning heads right now? \uD83D\uDD25 Here's what our clients can't stop requesting:\n\n\u2022 Velvet owambe dresses with stone embellishments\n\u2022 Mermaid Ankara gowns (that flare! that drama!)\n\u2022 Two-piece peplum sets for church and beyond\n\u2022 Aso-oke with modern cuts and metallic thread\n\u2022 Structured dashiki-inspired corporate wear\n\nHere's one of our freshest pieces:",
        design: newest,
        chips: ['Show me something beautiful', 'How to order', 'Pricing & timeline'],
      };
    },
  },
  // Fabric care
  {
    patterns: [/\b(care|wash|iron|maintain|preserve|store|clean|dry[\s-]?clean|stain)\b/],
    reply: () => ({
      text:
        "Taking care of your beautiful pieces, love? Here are my tips: \uD83E\uDDF5\n\n\u2022 **Ankara & cotton**: Hand wash in cool water, hang dry in shade. Iron inside-out.\n\u2022 **Lace & delicates**: Dry clean only, darling. No shortcuts!\n\u2022 **Velvet & brocade**: Steam gently, store hanging in a garment bag.\n\u2022 **Aso-oke**: Roll (never fold!) and store in a cool, dry place.\n\u2022 **Beaded/embellished pieces**: Store flat with tissue between layers.\n\nTreat your clothes with love and they'll love you right back for years. \uD83D\uDC9B",
      chips: ['How to order', 'Show me something beautiful'],
    }),
  },
  // Compliments / Positive
  {
    patterns: [/\b(beautiful|amazing|love it|gorgeous|wonderful|wow|stunning|incredible|fantastic|love your|so pretty)\b/],
    reply: () => ({
      text:
        "Aww, you are TOO sweet! \uD83E\uDD79\uD83D\uDC9B Thank you, darling! Every compliment fuels our passion. Happiness pours her whole heart into each piece, and hearing that it resonates with you means the world to this little atelier.\n\nWant to make something beautiful yours? Or shall I show you more pieces to fall in love with?",
      chips: ['Show me something beautiful', 'How to order', 'What can you make for me?'],
    }),
  },
  // Group / Bulk orders
  {
    patterns: [/\b(group|bulk|family|uniform|team|matching|bridal party|bridesmaid|groomsmen)\b/],
    reply: () => ({
      text:
        "Group orders! \uD83D\uDE4C Now we're talking, darling! Whether it's matching aso-ebi for the whole bridal squad, corporate uniforms with your brand colours, or family outfits for a special occasion \u2014 we handle it all.\n\nFor groups of 5+, we offer special bulk pricing and dedicated timelines. Happiness will assign a point person to coordinate measurements, fittings, and delivery so nobody is left out.\n\nReady to dress your crew?",
      cta: { label: 'Enquire about group orders', href: buildWhatsAppUrl('Hello! I have a group/bulk order enquiry. Can we discuss options and pricing for multiple pieces?'), external: true },
      chips: ['Pricing & timeline', 'How long does it take?'],
    }),
  },
  // Alterations
  {
    patterns: [/\b(alter|fix|adjust|resize|tight|loose|shorter|longer|hem|take[\s-]?in|let[\s-]?out|repair)\b/],
    reply: () => ({
      text:
        "Of course, love! \u2702\uFE0F Whether it's a beloved piece that needs refreshing or something that's not sitting quite right, our hands can fix it:\n\n\u2022 Take in / let out (weight changes happen, darling, no judgment!)\n\u2022 Hemming and length adjustments\n\u2022 Restyling old pieces into something fresh\n\u2022 Fixing zips, beadwork, and embellishments\n\nAlterations typically take 5\u201310 days. Bring it to the studio or ship it to us!",
      cta: { label: 'Book an alteration', href: buildWhatsAppUrl('Hello! I have a piece that needs alterations. Can I bring it in or ship it to you?'), external: true },
      chips: ['Where are you?', 'Pricing & timeline'],
    }),
  },
  // First-time / nervous customer reassurance
  {
    patterns: [/\b(first[\s-]?time|never (ordered|bought|done)|nervous|not sure|how does (this|it) work|new (here|customer)|scared|worried|trust)\b/],
    reply: () => ({
      text:
        "Aww, welcome, darling — and relax, you're in the safest hands. \uD83D\uDC9B So many of our happiest clients started exactly where you are now. Here's how gentle it is:\n\n1\uFE0F\u20E3 You tell us your vision (even just a vibe or a photo).\n2\uFE0F\u20E3 We agree on the design, fabric, and a clear price — no surprises.\n3\uFE0F\u20E3 We take your measurements (in studio or by video call).\n4\uFE0F\u20E3 We sew with love and you do a fitting before it's final.\n\nThere's no pressure and no silly questions. Shall we start with something small, or are you dreaming big?",
      cta: { label: 'Say hello to Happiness \uD83D\uDC8C', href: buildWhatsAppUrl(generalEnquiryMessage()), external: true },
      chips: ['How to order', 'Pricing & timeline', 'Show me something beautiful'],
    }),
  },
  // Gift / surprise
  {
    patterns: [/\b(gift|surprise|present|for (my|her|him)|birthday|anniversary|valentine|mother|wife|sister|friend)\b/],
    reply: () => ({
      text:
        "What a thoughtful soul you are! \uD83C\uDF81 A bespoke piece is the kind of gift people never forget. We can work from a photo or even just their usual size, and we'll wrap it beautifully so the unboxing feels like a celebration.\n\nNot sure of their measurements? No wahala — a gift note lets them come in for their own fitting. Tell me who it's for and the occasion, and I'll help you pick something they'll adore.",
      cta: { label: 'Plan a gift with Happiness \u2728', href: buildWhatsAppUrl('Hello Happiness Fashion World! I would love to order a bespoke piece as a gift. Can you help me choose something special?'), external: true },
      chips: ['Pricing & timeline', 'How long does it take?', 'Show me something beautiful'],
    }),
  },
  // Show a design
  {
    patterns: [/\b(show|see|recommend|suggest|design|piece|outfit|something|inspire|inspiration|browse)\b/],
    reply: (_, designs) => {
      const featured = designs.find((d) => d.featured) ?? designs[0];
      return {
        text:
          "Let me show you something gorgeous, darling. \uD83D\uDC40\u2728 Here's a piece I absolutely adore right now. Tap it to see all the details, or browse our full collection above \u2014 and if you want a truly personal recommendation, take our AI Style Quiz. It's like having a stylist in your pocket!",
        design: featured,
        chips: ['View Collection', 'Take Style Quiz', 'How to order'],
      };
    },
  },
  // Wahala / Problem / Issue
  {
    patterns: [/\b(wahala|problem|issue|trouble|stress|frustrated|complain|wrong|bad)\b/],
    reply: () => ({
      text: "No wahala at all, darling! \uD83D\uDC9B Whatever the issue is, we go sort am together. At Happiness Fashion World, your satisfaction is everything to us. Tell me what happened and let me see how I can help \u2014 or if you prefer, I can connect you directly with Happiness on WhatsApp. She fixes everything with grace.",
      cta: { label: 'Chat with Happiness \uD83D\uDC8C', href: buildWhatsAppUrl('Hello Happiness! I have a concern about my order and would appreciate your help.'), external: true },
      chips: ['How to order', 'Where are you?', 'Pricing & timeline'],
    }),
  },
  // Abeg / Please / Beg
  {
    patterns: [/\b(abeg|beg|help me|assist me)\b/],
    reply: () => ({
      text: "Of course, my darling! \uD83E\uDD79 Anything for you \u2014 abeg no worry at all. Whatever you need, I'm here to make it happen with love. Just tell me what your heart desires and consider it done. That's the Happiness Fashion World promise!",
      chips: QUICK_REPLIES,
    }),
  },
  // Thanks
  {
    patterns: [/\b(thank|thanks|thx|appreciate|bless|grateful)\b/],
    reply: () => ({
      text: "The pleasure is all mine, sweetheart! \uD83D\uDC9B Anytime you need style guidance, sizing help, or just want to dream about your next piece \u2014 I'm right here. E kaabo, you're always welcome. \uD83C\uDF3A",
      cta: { label: 'Chat with Happiness directly', href: buildWhatsAppUrl(generalEnquiryMessage()), external: true },
    }),
  },
  // Goodbye
  {
    patterns: [/\b(bye|goodbye|see\s*you|talk\s*later|cheerio|later)\b/],
    reply: () => ({
      text: "Go and shine, darling! \u2728 The world deserves to see you looking your best. Come back anytime \u2014 I'll be here with fresh inspiration and all the style advice you need. Ka chi fo! \uD83D\uDC9B\uD83C\uDF3A",
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
  // Warm, helpful fallback with Nigerian pidgin
  return {
    id: makeId(),
    from: 'bot',
    text:
      "No worry at all, darling! \uD83D\uDC9B I want to make sure I understand you perfectly. Let me connect you with Happiness directly \u2014 she has a gift for reading exactly what a woman needs and turning it into something breathtaking. One WhatsApp message and she'll take beautiful care of you. E go be alright!",
    cta: { label: 'Chat with Happiness \uD83D\uDC8C', href: buildWhatsAppUrl(generalEnquiryMessage()), external: true },
    chips: QUICK_REPLIES,
  };
}

export function userMessage(text: string): BotMessage {
  return { id: makeId(), from: 'user', text };
}
