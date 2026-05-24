import { pexels } from '../utils/images';

export type DesignCategory =
  | 'Bridal'
  | 'Aso-Ebi & Owambe'
  | 'Ankara'
  | 'Kaftan & Boubou'
  | 'Corporate'
  | "Men's Tailoring";

export type Occasion = 'wedding' | 'gala' | 'work' | 'casual' | 'traditional' | 'party';
export type Vibe = 'romantic' | 'bold' | 'minimal' | 'classic' | 'playful';
export type ColorMood = 'neutral' | 'jewel' | 'pastel' | 'monochrome' | 'earthy';

export interface Design {
  id: string;
  name: string;
  category: DesignCategory;
  description: string;
  image: string;
  tags: string[];
  occasions: Occasion[];
  vibes: Vibe[];
  colorMood: ColorMood;
  featured?: boolean;
  isNew?: boolean;
  /** ISO date string for sorting "New Arrivals" */
  addedOn?: string;
  /** True when added by Happiness through the Add-Design panel (vs static catalog). */
  custom?: boolean;
}

// Static catalog. All photos are royalty-free from Pexels and have been
// hand-verified to feature African / Nigerian models. Happiness can swap any
// photo by editing the `image` field, OR by uploading her own through the
// Add-Design admin panel.
export const designs: Design[] = [
  {
    id: 'HF-001',
    name: 'Royal Aso-Ebi Set',
    category: 'Aso-Ebi & Owambe',
    description:
      'A regal aso-ebi ensemble in rich Lagos teal - fitted corseted top with high-slit wrapper and matching gele headtie. Hand-beaded and finished in our Abakaliki atelier for your traditional marriage celebration.',
    image: pexels(29060624),
    tags: ['aso-ebi', 'gele', 'owambe', 'corseted'],
    occasions: ['traditional', 'party', 'wedding'],
    vibes: ['bold', 'romantic'],
    colorMood: 'earthy',
    featured: true,
    isNew: true,
    addedOn: '2026-05-10',
  },
  {
    id: 'HF-002',
    name: 'Ankara Power Co-ord',
    category: 'Ankara',
    description:
      'Tailored Ankara two-piece in bold Vlisco print - structured blazer with peak lapels and tapered trousers. Confidence in print, made for the Lagos boardroom and beyond. Perfect for the modern Nigerian woman who commands attention.',
    image: pexels(10919896),
    tags: ['ankara', 'co-ord', 'tailored', 'office'],
    occasions: ['work', 'traditional'],
    vibes: ['bold', 'classic'],
    colorMood: 'jewel',
  },
  {
    id: 'HF-003',
    name: 'Igbo Bridal Blouse & Wrapper',
    category: 'Bridal',
    description:
      'A stunning Igbo traditional bridal set in premium George fabric with intricate hand-sewn beadwork. Fitted blouse with off-shoulder neckline and luxurious wrapper, crafted for your traditional marriage in Enugu, Calabar, or anywhere love takes you.',
    image: pexels(33890250),
    tags: ['george', 'bridal', 'igbo', 'traditional', 'beadwork'],
    occasions: ['traditional', 'wedding'],
    vibes: ['classic', 'romantic'],
    colorMood: 'jewel',
    isNew: true,
    addedOn: '2026-05-15',
  },
  {
    id: 'HF-004',
    name: 'Sunrise Day Dress',
    category: 'Ankara',
    description:
      'A flowing day dress in vibrant Ankara prints with cinched waist and flared hem. Perfect for Sunday service in Abakaliki, a naming ceremony in Abuja, or a relaxed owambe with family.',
    image: pexels(34625880),
    tags: ['day dress', 'flared', 'casual', 'ankara'],
    occasions: ['casual', 'party', 'traditional'],
    vibes: ['playful', 'romantic'],
    colorMood: 'earthy',
  },
  {
    id: 'HF-005',
    name: 'Boardroom Power Suit',
    category: 'Corporate',
    description:
      'Crisp tailored co-ord in monochrome suiting - structured blazer with sharp shoulders and wide-leg trouser. Confidence stitched into every seam, for the modern Nigerian executive making moves from Lagos to Abuja.',
    image: pexels(33120030),
    tags: ['suit', 'co-ord', 'corporate'],
    occasions: ['work'],
    vibes: ['minimal', 'classic'],
    colorMood: 'monochrome',
    featured: true,
  },
  {
    id: 'HF-006',
    name: 'Sunday Service Wrap',
    category: 'Ankara',
    description:
      'A breezy adire-inspired wrap dress with adjustable tie waist - flattering on every silhouette. Ready to throw on for service, a naming ceremony in Enugu, or an afternoon out on the town.',
    image: pexels(31880106),
    tags: ['wrap dress', 'easy', 'cotton', 'adire'],
    occasions: ['casual', 'work'],
    vibes: ['minimal', 'playful'],
    colorMood: 'pastel',
    isNew: true,
    addedOn: '2026-05-12',
  },
  {
    id: 'HF-007',
    name: 'Onyx Gala Gown',
    category: 'Kaftan & Boubou',
    description:
      'A floor-sweeping black gown with sculpted shoulder and bias-cut skirt. Quietly powerful - made for Lagos premieres, Abuja galas, and unforgettable nights that demand elegance.',
    image: pexels(33762215),
    tags: ['gala', 'evening', 'sculpted'],
    occasions: ['gala', 'party'],
    vibes: ['bold', 'minimal'],
    colorMood: 'monochrome',
  },
  {
    id: 'HF-008',
    name: 'Atelier Custom Fit',
    category: 'Bridal',
    description:
      'A made-to-measure piece crafted over multiple fittings in our Abakaliki atelier. Every stitch - from the fitted bodice to the hand-finished hem - drafted from your exact measurements. Perfect for your white wedding or engagement.',
    image: pexels(33942212),
    tags: ['bespoke', 'made-to-measure', 'fitting', 'bridal'],
    occasions: ['wedding', 'gala'],
    vibes: ['classic', 'romantic'],
    colorMood: 'neutral',
    featured: true,
    isNew: true,
    addedOn: '2026-05-08',
  },
  {
    id: 'HF-009',
    name: "Heritage Agbada (Men's)",
    category: "Men's Tailoring",
    description:
      'A regal agbada with hand-embroidered neckline in flowing brocade. Crafted with matching fila cap for the modern Nigerian gentleman attending a chieftaincy title ceremony or traditional wedding in grand style.',
    image: pexels(30075301),
    tags: ['agbada', 'embroidered', 'brocade', 'cap', 'fila'],
    occasions: ['traditional', 'wedding', 'party'],
    vibes: ['classic', 'bold'],
    colorMood: 'jewel',
    isNew: true,
    addedOn: '2026-05-12',
  },
  {
    id: 'HF-010',
    name: 'Adire Indigo Shift Dress',
    category: 'Ankara',
    description:
      'A modern shift dress in authentic hand-dyed adire textile from Abeokuta. The deep indigo Yoruba resist-dyed patterns tell a story of heritage, reimagined for everyday elegance. Effortless from the office to dinner.',
    image: pexels(7095050),
    tags: ['adire', 'indigo', 'shift dress', 'yoruba', 'handmade'],
    occasions: ['casual', 'work'],
    vibes: ['minimal', 'classic'],
    colorMood: 'monochrome',
    isNew: true,
    addedOn: '2026-05-18',
  },
  {
    id: 'HF-011',
    name: 'George Wrapper & Blouse',
    category: 'Aso-Ebi & Owambe',
    description:
      'Premium Indian George fabric styled in the Igbo tradition - a richly embellished blouse paired with expertly tied wrapper. The ultimate statement piece for a traditional marriage ceremony in Enugu or Calabar.',
    image: pexels(7691070),
    tags: ['george', 'wrapper', 'igbo', 'traditional', 'owambe'],
    occasions: ['traditional', 'wedding', 'party'],
    vibes: ['bold', 'romantic'],
    colorMood: 'jewel',
    isNew: true,
    addedOn: '2026-05-20',
  },
  {
    id: 'HF-012',
    name: 'Senator Kaftan',
    category: "Men's Tailoring",
    description:
      'A sharp senator-style kaftan in premium cashmere blend with clean lines and subtle embroidery at the collar. The go-to for Nigerian men who want understated power dressing - from Abuja political circles to Lagos business dinners.',
    image: pexels(31485635),
    tags: ['senator', 'kaftan', 'embroidered', 'cashmere'],
    occasions: ['work', 'traditional', 'party'],
    vibes: ['classic', 'minimal'],
    colorMood: 'neutral',
    isNew: true,
    addedOn: '2026-05-22',
  },
  {
    id: 'HF-013',
    name: 'Aso-Oke Celebration Set',
    category: 'Aso-Ebi & Owambe',
    description:
      'A breathtaking aso-oke ensemble hand-woven in Ilorin and styled with modern flair. Rich jewel tones with metallic thread accents - perfect for that special owambe where you want all eyes on you.',
    image: pexels(8191439),
    tags: ['aso-oke', 'hand-woven', 'celebration', 'owambe', 'metallic'],
    occasions: ['traditional', 'wedding', 'party'],
    vibes: ['bold', 'classic'],
    colorMood: 'jewel',
    isNew: true,
    addedOn: '2026-05-22',
  },
  {
    id: 'HF-014',
    name: 'Ankara Mermaid Gown',
    category: 'Ankara',
    description:
      'A show-stopping mermaid silhouette in vibrant Ankara wax print. Fitted through the bodice and hips with a dramatic flare below the knee. The bold print speaks volumes while the cut whispers pure elegance.',
    image: pexels(8152356),
    tags: ['mermaid', 'ankara', 'gown', 'fitted', 'dramatic'],
    occasions: ['party', 'gala', 'wedding'],
    vibes: ['bold', 'romantic'],
    colorMood: 'jewel',
    isNew: true,
    addedOn: '2026-05-21',
  },
  {
    id: 'HF-015',
    name: 'Royal Chief Agbada',
    category: "Men's Tailoring",
    description:
      'A majestic agbada in rich brocade with hand-embroidered collar and cuffs. Three-piece set includes the flowing outer robe, fitted undershirt, and matching trousers. Fit for a king attending his coronation.',
    image: pexels(5876668),
    tags: ['agbada', 'brocade', 'embroidered', 'three-piece', 'royalty'],
    occasions: ['traditional', 'wedding', 'party'],
    vibes: ['classic', 'bold'],
    colorMood: 'jewel',
    isNew: true,
    addedOn: '2026-05-20',
  },
  {
    id: 'HF-016',
    name: 'Ankara Peplum Blouse & Skirt',
    category: 'Ankara',
    description:
      'A playful yet sophisticated peplum blouse paired with a pencil skirt in coordinating Ankara prints. The structured peplum nips the waist beautifully while the skirt glides over curves. Church-ready, office-approved, owambe-perfect.',
    image: pexels(11041780),
    tags: ['peplum', 'ankara', 'blouse', 'skirt', 'two-piece'],
    occasions: ['work', 'traditional', 'party'],
    vibes: ['playful', 'classic'],
    colorMood: 'earthy',
    isNew: true,
    addedOn: '2026-05-19',
  },
  {
    id: 'HF-017',
    name: 'Velvet Owambe Dress',
    category: 'Aso-Ebi & Owambe',
    description:
      'Luxurious crushed velvet in deep wine tones, draped into an off-shoulder masterpiece. Stone embellishments catch the light as you move through the reception hall. Your owambe moment, elevated.',
    image: pexels(7679865),
    tags: ['velvet', 'off-shoulder', 'owambe', 'stones', 'evening'],
    occasions: ['party', 'wedding', 'gala'],
    vibes: ['romantic', 'bold'],
    colorMood: 'jewel',
    isNew: true,
    addedOn: '2026-05-18',
  },
  {
    id: 'HF-018',
    name: 'Lace Bridal Reception Dress',
    category: 'Bridal',
    description:
      'A second-look reception dress in premium French lace with illusion neckline and fitted bodice. Delicate beadwork traces the lace motifs while the trumpet skirt gives you room to dance all night at your reception.',
    image: pexels(9255589),
    tags: ['lace', 'bridal', 'reception', 'french-lace', 'beadwork'],
    occasions: ['wedding'],
    vibes: ['romantic', 'classic'],
    colorMood: 'neutral',
    isNew: true,
    addedOn: '2026-05-17',
  },
  {
    id: 'HF-019',
    name: 'Ankara A-Line Sunday Dress',
    category: 'Ankara',
    description:
      'A flirty A-line dress in cheerful Ankara print with cap sleeves and a twirl-worthy hem. Light, breezy, and joyful - the kind of dress that makes every Sunday morning feel like a celebration.',
    image: pexels(6462630),
    tags: ['a-line', 'ankara', 'sunday', 'flared', 'casual'],
    occasions: ['casual', 'traditional'],
    vibes: ['playful', 'romantic'],
    colorMood: 'earthy',
    isNew: true,
    addedOn: '2026-05-16',
  },
  {
    id: 'HF-020',
    name: 'Dashiki Corporate Set',
    category: 'Corporate',
    description:
      'A refined take on the classic dashiki silhouette, reimagined for the modern boardroom. Structured shoulders, clean lines, and subtle embroidery at the collar. Power dressing with deep cultural roots.',
    image: pexels(15664540),
    tags: ['dashiki', 'corporate', 'structured', 'embroidered', 'power-dressing'],
    occasions: ['work', 'traditional'],
    vibes: ['classic', 'minimal'],
    colorMood: 'earthy',
    isNew: true,
    addedOn: '2026-05-15',
  },
];

export const categories: DesignCategory[] = [
  'Bridal',
  'Aso-Ebi & Owambe',
  'Ankara',
  'Kaftan & Boubou',
  'Corporate',
  "Men's Tailoring",
];
