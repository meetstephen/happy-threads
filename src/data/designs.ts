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

// Static catalog. All photos are royalty-free from Pexels and feature
// African models in authentic Nigerian/African attire.
// Happiness can swap any photo by editing the `image` field, OR by using
// the in-app "Add Design" panel (see Footer ✦ admin button).
export const designs: Design[] = [
  {
    id: 'HF-001',
    name: 'Royal Aso-Ebi Set',
    category: 'Aso-Ebi & Owambe',
    description:
      'A regal aso-ebi ensemble — fitted corseted top with high-slit wrapper and matching gele headtie. Hand-finished for the celebration of a lifetime.',
    image: pexels(30030552),
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
      'Tailored Ankara two-piece — structured blazer with peak lapels and tapered trousers. Confidence in print, made for the boardroom and beyond.',
    image: pexels(3869639),
    tags: ['ankara', 'co-ord', 'tailored', 'office'],
    occasions: ['work', 'traditional'],
    vibes: ['bold', 'classic'],
    colorMood: 'jewel',
    featured: true,
  },
  {
    id: 'HF-003',
    name: 'Sahara Kaftan Boubou',
    category: 'Kaftan & Boubou',
    description:
      'Flowing boubou kaftan in earthy tones with embroidered yoke and bell sleeves. Effortlessly elegant for any season.',
    image: pexels(15944276),
    tags: ['kaftan', 'boubou', 'embroidered'],
    occasions: ['casual', 'traditional', 'party'],
    vibes: ['romantic', 'playful'],
    colorMood: 'earthy',
    featured: true,
    isNew: true,
    addedOn: '2026-05-15',
  },
  {
    id: 'HF-004',
    name: 'Heritage Headwrap Set',
    category: 'Aso-Ebi & Owambe',
    description:
      'A statement headwrap and matching wrap dress in patterned fabric. Worn for weddings, naming ceremonies, and Sunday best.',
    image: pexels(18003195),
    tags: ['headwrap', 'wrap dress', 'traditional'],
    occasions: ['traditional', 'casual', 'party'],
    vibes: ['classic', 'romantic'],
    colorMood: 'neutral',
  },
  {
    id: 'HF-005',
    name: 'Boardroom Ankara Suit',
    category: 'Corporate',
    description:
      'Crisp Ankara-trim blazer with ivory linen shell and wide-leg trouser. Tailored confidence for the modern Nigerian executive.',
    image: pexels(19209599),
    tags: ['ankara trim', 'blazer', 'corporate'],
    occasions: ['work'],
    vibes: ['minimal', 'classic'],
    colorMood: 'monochrome',
    featured: true,
  },
  {
    id: 'HF-006',
    name: 'Pearl Bridal Gown',
    category: 'Bridal',
    description:
      'A dreamy bridal gown crafted over four fittings — fitted lace bodice, cathedral train, and hand-set pearl detailing throughout.',
    image: pexels(17586999),
    tags: ['bridal', 'lace', 'cathedral train', 'pearl'],
    occasions: ['wedding'],
    vibes: ['romantic', 'classic'],
    colorMood: 'neutral',
    featured: true,
    isNew: true,
    addedOn: '2026-05-08',
  },
  {
    id: 'HF-007',
    name: 'Pink Daystar Kaftan',
    category: 'Kaftan & Boubou',
    description:
      'A breezy kaftan in dusty rose with intricate beaded neckline. Soft, modest, and unmistakably feminine.',
    image: pexels(31712094),
    tags: ['kaftan', 'beaded', 'modest'],
    occasions: ['casual', 'traditional'],
    vibes: ['romantic', 'playful'],
    colorMood: 'pastel',
  },
  {
    id: 'HF-008',
    name: 'Onyx Evening Wrap',
    category: 'Kaftan & Boubou',
    description:
      'A dramatic black floor-length wrap with structured shoulder. Quietly powerful for evening events.',
    image: pexels(4029925),
    tags: ['evening', 'wrap', 'minimal'],
    occasions: ['gala', 'party'],
    vibes: ['minimal', 'bold'],
    colorMood: 'monochrome',
  },
  {
    id: 'HF-009',
    name: "Heritage Agbada (Men's)",
    category: "Men's Tailoring",
    description:
      'A regal three-piece agbada with hand-embroidered neckline and matching cap. Crafted in flowing brocade for the modern gentleman.',
    image: pexels(34660898),
    tags: ['agbada', 'embroidered', 'brocade', 'cap'],
    occasions: ['traditional', 'wedding', 'party'],
    vibes: ['classic', 'bold'],
    colorMood: 'jewel',
    isNew: true,
    addedOn: '2026-05-12',
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
