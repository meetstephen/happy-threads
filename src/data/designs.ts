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
    name: 'West African Heritage Set',
    category: 'Aso-Ebi & Owambe',
    description:
      'A heritage-inspired traditional set with fitted top, high-slit wrapper, and detailed accents. A celebration of West African elegance.',
    image: pexels(31486360),
    tags: ['heritage', 'traditional', 'embellished'],
    occasions: ['traditional', 'wedding', 'party'],
    vibes: ['classic', 'romantic'],
    colorMood: 'jewel',
    featured: true,
    isNew: true,
    addedOn: '2026-05-15',
  },
  {
    id: 'HF-004',
    name: 'Sunrise Day Dress',
    category: 'Ankara',
    description:
      'A flowing day dress in vibrant prints with cinched waist and flared hem. Perfect for Sunday service, a brunch outing, or a relaxed owambe.',
    image: pexels(15020799),
    tags: ['day dress', 'flared', 'casual'],
    occasions: ['casual', 'party', 'traditional'],
    vibes: ['playful', 'romantic'],
    colorMood: 'earthy',
  },
  {
    id: 'HF-005',
    name: 'Boardroom Power Suit',
    category: 'Corporate',
    description:
      'Crisp tailored co-ord — structured blazer with sharp shoulders and wide-leg trouser. Confidence stitched into every seam, for the modern Nigerian executive.',
    image: pexels(19209599),
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
      'A breezy wrap dress with adjustable tie waist — flattering on every silhouette, ready to throw on for service, brunch, or an afternoon out.',
    image: pexels(5248020),
    tags: ['wrap dress', 'easy', 'cotton'],
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
      'A floor-sweeping black gown with sculpted shoulder and bias-cut skirt. Quietly powerful — made for premieres, galas, and unforgettable nights.',
    image: pexels(17980365),
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
      'A made-to-measure piece crafted over multiple fittings. Every stitch — from the fitted bodice to the hand-finished hem — drafted from your exact measurements at the atelier.',
    image: pexels(5934222),
    tags: ['bespoke', 'made-to-measure', 'fitting'],
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
      'A regal agbada with hand-embroidered neckline. Crafted in flowing brocade with matching cap — for the modern Nigerian gentleman.',
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
