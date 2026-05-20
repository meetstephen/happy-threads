export type DesignCategory =
  | 'Bridal'
  | 'Evening Gowns'
  | 'Ankara & Aso-Ebi'
  | 'Ready-to-Wear'
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
}

// Note: placeholder imagery from Unsplash (free to use). Happiness can swap each
// `image` URL with her own photo by editing this single file.
export const designs: Design[] = [
  {
    id: 'HF-001',
    name: 'Ivory Cathedral Gown',
    category: 'Bridal',
    description:
      'A cathedral-train bridal gown in silk mikado with hand-beaded bodice and illusion neckline. Made-to-measure over four fittings.',
    image: 'https://images.unsplash.com/photo-1594552072238-b8a33785b261?w=900&q=80',
    tags: ['silk', 'beaded', 'cathedral train', 'bespoke'],
    occasions: ['wedding'],
    vibes: ['romantic', 'classic'],
    colorMood: 'neutral',
    featured: true,
  },
  {
    id: 'HF-002',
    name: 'Burgundy Mermaid',
    category: 'Evening Gowns',
    description:
      'A floor-sweeping mermaid gown in deep burgundy crepe — sculpted bodice, dramatic flare, made for unforgettable nights.',
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=900&q=80',
    tags: ['mermaid', 'red carpet', 'crepe'],
    occasions: ['gala', 'party'],
    vibes: ['bold', 'romantic'],
    colorMood: 'jewel',
    featured: true,
  },
  {
    id: 'HF-003',
    name: 'Aso-Ebi Royale',
    category: 'Ankara & Aso-Ebi',
    description:
      'Owambe-ready aso-ebi ensemble featuring a corseted blouse and high-slit skirt in pleated taffeta with gele to match.',
    image: 'https://images.unsplash.com/photo-1617922001439-4a2e6562f328?w=900&q=80',
    tags: ['aso-ebi', 'owambe', 'gele', 'corset'],
    occasions: ['traditional', 'party'],
    vibes: ['bold', 'playful'],
    colorMood: 'jewel',
    featured: true,
  },
  {
    id: 'HF-004',
    name: 'Ankara Power Suit',
    category: 'Ankara & Aso-Ebi',
    description:
      'Tailored two-piece Ankara suit — structured blazer with peak lapels and tapered trousers. Confidence in print.',
    image: 'https://images.unsplash.com/photo-1551803091-e20673f15770?w=900&q=80',
    tags: ['ankara', 'suit', 'tailored'],
    occasions: ['work', 'traditional'],
    vibes: ['bold', 'classic'],
    colorMood: 'earthy',
  },
  {
    id: 'HF-005',
    name: 'Champagne Slip',
    category: 'Evening Gowns',
    description:
      'A bias-cut silk slip dress in champagne gold — minimalist, sensual, effortlessly elegant.',
    image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=900&q=80',
    tags: ['silk', 'minimalist', 'bias cut'],
    occasions: ['gala', 'party'],
    vibes: ['minimal', 'romantic'],
    colorMood: 'neutral',
  },
  {
    id: 'HF-006',
    name: 'Linen Boardroom Set',
    category: 'Corporate',
    description:
      'Crisp ivory linen co-ord — a relaxed blazer and wide-leg trouser. Tailored confidence for the modern executive.',
    image: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=900&q=80',
    tags: ['linen', 'co-ord', 'office'],
    occasions: ['work'],
    vibes: ['minimal', 'classic'],
    colorMood: 'neutral',
  },
  {
    id: 'HF-007',
    name: 'Sunday Brunch Wrap',
    category: 'Ready-to-Wear',
    description:
      'A breezy wrap dress in soft cotton sateen — flattering on every silhouette, ready to throw on and go.',
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=900&q=80',
    tags: ['wrap dress', 'cotton', 'easy'],
    occasions: ['casual', 'party'],
    vibes: ['playful', 'romantic'],
    colorMood: 'pastel',
  },
  {
    id: 'HF-008',
    name: 'Emerald Cocktail',
    category: 'Evening Gowns',
    description:
      'Knee-length emerald velvet cocktail dress with sweetheart neckline — a jewel for intimate evenings.',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=900&q=80',
    tags: ['velvet', 'cocktail', 'sweetheart'],
    occasions: ['party', 'gala'],
    vibes: ['bold', 'romantic'],
    colorMood: 'jewel',
  },
  {
    id: 'HF-009',
    name: 'Heritage Agbada (Men)',
    category: "Men's Tailoring",
    description:
      'A regal three-piece agbada in cream brocade with hand-embroidered neckline. Crafted for the modern gentleman.',
    image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=900&q=80',
    tags: ['agbada', 'embroidered', 'brocade'],
    occasions: ['traditional', 'wedding'],
    vibes: ['classic', 'bold'],
    colorMood: 'neutral',
  },
  {
    id: 'HF-010',
    name: 'Slim Charcoal Suit (Men)',
    category: "Men's Tailoring",
    description:
      'Two-piece slim-cut suit in charcoal wool blend with a crisp white shirt. Made-to-measure precision.',
    image: 'https://images.unsplash.com/photo-1593032465175-481ac7f401a0?w=900&q=80',
    tags: ['suit', 'wool', 'slim fit'],
    occasions: ['work', 'gala', 'wedding'],
    vibes: ['minimal', 'classic'],
    colorMood: 'monochrome',
  },
  {
    id: 'HF-011',
    name: 'Sahara Kaftan',
    category: 'Ready-to-Wear',
    description:
      'Flowing kaftan in earthy ochre with bell sleeves and beaded trim. Quietly luxurious for any season.',
    image: 'https://images.unsplash.com/photo-1583846783214-7229a91b20ed?w=900&q=80',
    tags: ['kaftan', 'beaded', 'flowy'],
    occasions: ['casual', 'party', 'traditional'],
    vibes: ['romantic', 'playful'],
    colorMood: 'earthy',
  },
  {
    id: 'HF-012',
    name: 'Blush Princess Gown',
    category: 'Bridal',
    description:
      'A blush-pink ball gown with layered tulle skirt, bodice in French lace, and a soft cathedral veil.',
    image: 'https://images.unsplash.com/photo-1525258946800-98cfd641d0de?w=900&q=80',
    tags: ['ball gown', 'lace', 'tulle'],
    occasions: ['wedding'],
    vibes: ['romantic', 'classic'],
    colorMood: 'pastel',
    featured: true,
  },
];

export const categories: DesignCategory[] = [
  'Bridal',
  'Evening Gowns',
  'Ankara & Aso-Ebi',
  'Ready-to-Wear',
  'Corporate',
  "Men's Tailoring",
];
