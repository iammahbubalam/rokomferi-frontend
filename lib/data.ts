export interface ProductVariant {
  id: string;
  name: string; // e.g., "Small / Red"
  sku: string;
  price?: number; // Override if different
  stock: number;
  options: {
    [key: string]: string; // e.g., { size: "S", color: "Red" }
  };
}

export interface ProductSEO {
  title: string;
  description: string;
  keywords: string[];
}

export interface ProductMedia {
  id: string;
  type: "image" | "video";
  url: string;
  alt: string;
  isThumbnail?: boolean;
}

export interface ProductPricing {
  basePrice: number;
  salePrice?: number;
  currency: string;
}

export interface ProductInventory {
  stockLevel: number;
  lowStockThreshold: number;
  trackQuantity: boolean;
  status: "in_stock" | "out_of_stock" | "pre_order";
}

export interface ProductDimensions {
  weight?: number; // in kg
  length?: number; // in cm
  width?: number; // in cm
  height?: number; // in cm
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  category: string;
  description: string;
  
  // New Enhanced Fields
  pricing: ProductPricing;
  media: ProductMedia[];
  inventory: ProductInventory;
  variants?: ProductVariant[];
  seo?: ProductSEO;
  dimensions?: ProductDimensions;
  tags?: string[];
  status: "draft" | "published" | "archived";

  // Legacy/Helper getters (computed)
  // We will likely refactor these out or keep them as helpers, but for now strict data
  
  // Specific StoryBrand Fields
  weaversNote?: string;
  fabricStory?: string;
  specifications?: {
    material: string;
    weave: string;
    origin: string;
    care: string[];
  };
  
  // Legacy fields for backward compatibility (simulated)
  // price: number; // Removed, use pricing.basePrice
  // images: string[]; // Removed, use media[].url
  // inStock: boolean; // Removed, use inventory.status
}

// ... Category Tree Structure (Unchanged)
export interface CategoryNode {
  id: string;
  name: string;
  slug: string;
  path?: string; 
  children?: CategoryNode[];
}

export const CATEGORY_TREE: CategoryNode[] = [
  {
    id: "new",
    name: "New Arrivals",
    slug: "new-arrivals",
    children: []
  },
  {
    id: "c1",
    name: "Women",
    slug: "women",
    children: [
      {
        id: "c1-1",
        name: "Ethnic Wear",
        slug: "ethnic-wear",
        children: [
           { id: "c1-1-1", name: "Sarees (Katan)", slug: "sarees-katan" },
           { id: "c1-1-2", name: "Sarees (Jamdani)", slug: "sarees-jamdani" },
           { id: "c1-1-3", name: "Salwar Kameez", slug: "salwar-kameez" },
           { id: "c1-1-4", name: "Kurtis", slug: "kurtis" },
        ]
      },
      {
        id: "c1-2",
        name: "Fabrics",
        slug: "fabrics",
        children: [
           { id: "c1-2-1", name: "Unstitched", slug: "unstitched" },
           { id: "c1-2-2", name: "Silk", slug: "silk-fabric" },
        ]
      }
    ]
  },
  {
    id: "c2",
    name: "Collections",
    slug: "collections",
    children: [
      { id: "c2-1", name: "Eid 2026", slug: "eid-2026", path: "/collection/eid-2026" },
      { id: "c2-2", name: "Wedding Guest", slug: "wedding-guest", path: "/collection/wedding-guest" },
      { id: "c2-3", name: "Heritage", slug: "heritage", path: "/collection/heritage" }
    ]
  }
];

export const PRODUCTS: Product[] = [
  // --- SAREES ---
  {
    id: "p1",
    name: "Royal Blue Katan Silk",
    slug: "royal-blue-katan",
    sku: "KS-BLU-001",
    category: "Sarees",
    description: "Handwoven Katan silk saree with intricate gold zari par. A timeless piece for the wedding season. The deep royal blue hue is achieved through natural indigo dyes, enhanced with a double-polished finish for lasting luster.",
    status: "published",
    pricing: { basePrice: 12500, currency: "BDT" },
    inventory: { stockLevel: 5, lowStockThreshold: 2, trackQuantity: true, status: "in_stock" },
    media: [{ id: "m1", type: "image", url: "/assets/saree-blue-katan.png", alt: "Royal Blue Katan Silk Saree", isThumbnail: true }],
    weaversNote: "Woven in the heart of Mirpur Benarasi Polli, this piece took 14 days to complete. The artisan, Rahim Miah, specializes in 'Jangle' motifs.",
    fabricStory: "Pure Katan Silk is known for its durability and glossy texture. Created by twisting two silk filaments together, it creates a sturdy yet fluid drape.",
    specifications: { material: "100% Mulberry Silk", weave: "Handloom Katan Benarasi", origin: "Dhaka, Bangladesh", care: ["Dry clean only", "Store in muslin cloth"] },
    tags: ["eid", "wedding", "silk", "blue", "heritage"]
  },
  {
    id: "p4",
    name: "Muslin Jamdani Saree",
    slug: "muslin-jamdani",
    sku: "MS-JAM-004",
    category: "Sarees",
    description: "Authentic Dhakai Muslin Jamdani. Feather-light weave with traditional geometric motifs. A revival of the lost textile art suitable for the most prestigious occasions.",
    status: "published",
    pricing: { basePrice: 118000, currency: "BDT" },
    inventory: { stockLevel: 2, lowStockThreshold: 1, trackQuantity: true, status: "in_stock" },
    media: [{ id: "m4", type: "image", url: "/assets/eid-texture.png", alt: "Muslin Jamdani Texture", isThumbnail: true }],
    weaversNote: "A revivement of the lost art. This 80-count muslin saree features the 'Corolla' motif. It is so fine it can pass through a ring.",
    fabricStory: "The legend of Muslin. Spun from the Phuti karpas cotton, it is the finest cotton fabric in existence.",
    specifications: { material: "Cotton Muslin (80 count)", weave: "Handloom Jamdani", origin: "Narayanganj, Bangladesh", care: ["Professional dry clean only"] },
    tags: ["luxury", "heritage", "muslin", "white", "premium"]
  },
  {
    id: "p5",
    name: "Midnight Velocity Saree",
    slug: "midnight-velocity",
    sku: "MV-SAR-005",
    category: "Sarees",
    description: "A bold experiment in silk. Dark navy with silver dust, inspired by the night sky over the Padma river.",
    status: "published",
    pricing: { basePrice: 22000, salePrice: 18500, currency: "BDT" },
    inventory: { stockLevel: 3, lowStockThreshold: 5, trackQuantity: true, status: "in_stock" },
    media: [{ id: "m5", type: "image", url: "/assets/saree-blue-katan.png", alt: "Midnight Saree", isThumbnail: true }],
    tags: ["sale", "party", "modern", "blue"]
  },
  {
    id: "p6",
    name: "Golden Era Jamdani",
    slug: "golden-era-jamdani",
    sku: "GE-JAM-006",
    category: "Sarees",
    description: "The gold standard of Dhakai weaving. Features real Zari threadwork on a beige cotton base.",
    status: "published",
    pricing: { basePrice: 45000, currency: "BDT" },
    inventory: { stockLevel: 0, lowStockThreshold: 1, trackQuantity: true, status: "out_of_stock" },
    media: [{ id: "m6", type: "image", url: "/assets/eid-texture.png", alt: "Golden Jamdani", isThumbnail: true }],
    tags: ["heritage", "gold", "classic"]
  },
  {
    id: "p7",
    name: "Crimson Bridal Katan",
    slug: "crimson-bridal-katan",
    sku: "KS-RED-007",
    category: "Sarees",
    description: "A quintessential bridal masterpiece. Rich crimson red with heavy gold minekaari work throughout the body.",
    status: "published",
    pricing: { basePrice: 35000, currency: "BDT" },
    inventory: { stockLevel: 5, lowStockThreshold: 2, trackQuantity: true, status: "in_stock" },
    media: [{ id: "m7", type: "image", url: "/assets/saree-crimson-bridal.png", alt: "Crimson Bridal Katan", isThumbnail: true }],
    tags: ["wedding", "bridal", "red", "heavy"]
  },

  // --- THREE PIECE & SALWAR KAMEEZ ---
  {
    id: "p2",
    name: "Peach Organza Luxe Suit",
    slug: "peach-organza-suit",
    sku: "OZ-PCH-002",
    category: "Salwar Kameez",
    description: "Premium 3-piece organza suit with heavy floral embroidery and a sheer, flowy dupatta.",
    status: "published",
    pricing: { basePrice: 8500, currency: "BDT" },
    inventory: { stockLevel: 12, lowStockThreshold: 5, trackQuantity: true, status: "in_stock" },
    media: [{ id: "m2", type: "image", url: "/assets/threepiece-peach.png", alt: "Peach Organza Luxe Suit", isThumbnail: true }],
    weaversNote: "Designed for the modern sophisticate, this suit balances the weight of heavy zardosi work with the ethereal lightness of organza.",
    fabricStory: "Sheer, crisp, and lightweight. Our Organza is sourced ensuring a high thread count.",
    specifications: { material: "Semi-Organza & Raw Silk", weave: "Machine Embroidered", origin: "Tangail, Bangladesh", care: ["Dry clean recommended"] },
    tags: ["eid", "party", "peach", "organza"],
    variants: [
        { id: "v2-s", name: "S", sku: "OZ-PCH-002-S", stock: 4, options: { size: "S" } },
        { id: "v2-m", name: "M", sku: "OZ-PCH-002-M", stock: 6, options: { size: "M" } },
        { id: "v2-l", name: "L", sku: "OZ-PCH-002-L", stock: 2, options: { size: "L" } }
    ]
  },
  {
    id: "p8",
    name: "Lilac Chiffon Party Wear",
    slug: "lilac-chiffon-suit",
    sku: "CF-LIL-008",
    category: "Salwar Kameez",
    description: "Soft lilac chiffon kameez with pearl embellishments. Includes a matching trouser and embroidered dupatta.",
    status: "published",
    pricing: { basePrice: 6500, currency: "BDT" },
    inventory: { stockLevel: 8, lowStockThreshold: 3, trackQuantity: true, status: "in_stock" },
    media: [{ id: "m8", type: "image", url: "/assets/threepiece-lilac-chiffon.png", alt: "Lilac Chiffon", isThumbnail: true }],
    tags: ["party", "summer", "pastel", "light"]
  },
  {
    id: "p9",
    name: "Black Georgette Noir",
    slug: "black-georgette-noir",
    sku: "GT-BLK-009",
    category: "Salwar Kameez",
    description: "Jet black georgette suit with velvet patches and antique gold sequins.",
    status: "published",
    pricing: { basePrice: 9200, currency: "BDT" },
    inventory: { stockLevel: 15, lowStockThreshold: 5, trackQuantity: true, status: "in_stock" },
    media: [{ id: "m9", type: "image", url: "/assets/threepiece-black-georgette.png", alt: "Black Georgette", isThumbnail: true }],
    tags: ["evening", "black", "luxury"]
  },

  // --- KURTIS ---
  {
    id: "p3",
    name: "Emerald Silk Kurti",
    slug: "emerald-silk-kurti",
    sku: "SK-EMR-003",
    category: "Kurtis",
    description: "Pure silk kurti featuring a zardosi embroidered neckline. Styled for modern elegance.",
    status: "published",
    pricing: { basePrice: 4200, currency: "BDT" },
    inventory: { stockLevel: 20, lowStockThreshold: 5, trackQuantity: true, status: "in_stock" },
    media: [{ id: "m3", type: "image", url: "/assets/kurti-emerald.png", alt: "Emerald Silk Kurti", isThumbnail: true }],
    weaversNote: "A fusion of traditional silhouette and contemporary minimalism.",
    fabricStory: "Rajshahi Silk, renowned for its soft hand-feel and matte luster.",
    specifications: { material: "100% Rajshahi Silk", weave: "Plain Weave", origin: "Rajshahi, Bangladesh", care: ["Hand wash cold"] },
    tags: ["casual", "eid", "green", "silk"]
  },
  {
    id: "p10",
    name: "Ruby Cotton Tunic",
    slug: "ruby-cotton-tunic",
    sku: "CT-RED-010",
    category: "Kurtis",
    description: "Breathable cotton linen blend tunic in a deep ruby red. Features wooden buttons and roll-up sleeves.",
    status: "published",
    pricing: { basePrice: 2500, currency: "BDT" },
    inventory: { stockLevel: 45, lowStockThreshold: 10, trackQuantity: true, status: "in_stock" },
    media: [{ id: "m10", type: "image", url: "/assets/kurti-ruby-cotton.png", alt: "Ruby Tunic", isThumbnail: true }],
    tags: ["casual", "office", "summer", "red"]
  },
  {
    id: "p11",
    name: "Ivory Khadi Long Kurti",
    slug: "ivory-khadi-kurti",
    sku: "KD-IVO-011",
    category: "Kurtis",
    description: "Hand-spun Khadi cotton kurti in natural ivory. Minimalist aesthetic with subtle self-textured stripes.",
    status: "published",
    pricing: { basePrice: 3200, currency: "BDT" },
    inventory: { stockLevel: 10, lowStockThreshold: 5, trackQuantity: true, status: "in_stock" },
    media: [{ id: "m11", type: "image", url: "/assets/kurti-ivory-khadi.png", alt: "Ivory Khadi", isThumbnail: true }],
    tags: ["minimalist", "summer", "white", "sustainable"]
  },

  // --- PANJABIS (MEN) ---
  {
    id: "p12",
    name: "Platinum White Panjabi",
    slug: "platinum-white-panjabi",
    sku: "PJ-WHT-012",
    category: "Panjabi",
    description: "Premium Egyptian cotton panjabi with hand-stitched collar details. The epitome of understated luxury for Eid prayer.",
    status: "published",
    pricing: { basePrice: 5500, currency: "BDT" },
    inventory: { stockLevel: 30, lowStockThreshold: 5, trackQuantity: true, status: "in_stock" },
    media: [{ id: "m12", type: "image", url: "/assets/panjabi-platinum-white.png", alt: "White Panjabi", isThumbnail: true }],
    tags: ["eid", "men", "formal", "white"],
    variants: [
        { id: "v12-m", name: "M", sku: "PJ-WHT-012-M", stock: 10, options: { size: "M" } },
        { id: "v12-l", name: "L", sku: "PJ-WHT-012-L", stock: 15, options: { size: "L" } },
        { id: "v12-xl", name: "XL", sku: "PJ-WHT-012-XL", stock: 5, options: { size: "XL" } }
    ]
  },
  {
    id: "p13",
    name: "Midnight Indigo Panjabi",
    slug: "indigo-panjabi",
    sku: "PJ-IND-013",
    category: "Panjabi",
    description: "Deep indigo silk-cotton blend panjabi. Slight sheen suitable for evening gatherings.",
    status: "published",
    pricing: { basePrice: 6200, currency: "BDT" },
    inventory: { stockLevel: 18, lowStockThreshold: 5, trackQuantity: true, status: "in_stock" },
    media: [{ id: "m13", type: "image", url: "/assets/panjabi-indigo-silk.png", alt: "Indigo Panjabi", isThumbnail: true }],
    tags: ["evening", "men", "blue", "wedding"]
  },
  {
    id: "p14",
    name: "Sage Green Embroidered Panjabi",
    slug: "sage-green-panjabi",
    sku: "PJ-SAGE-014",
    category: "Panjabi",
    description: "Soft sage green fabric with tonal embroidery on the placket and cuffs.",
    status: "published",
    pricing: { basePrice: 4800, currency: "BDT" },
    inventory: { stockLevel: 15, lowStockThreshold: 5, trackQuantity: true, status: "in_stock" },
    media: [{ id: "m14", type: "image", url: "/assets/panjabi-sage-green.png", alt: "Sage Panjabi", isThumbnail: true }],
    tags: ["eid", "men", "green", "modern"]
  },

  // --- ACCESSORIES ---
  {
    id: "p15",
    name: "Pearl & Gold Choker",
    slug: "pearl-gold-choker",
    sku: "AC-JW-015",
    category: "Accessories",
    description: "Hyderabadi pearl choker with gold-plated accents. Adjustable drawstring back.",
    status: "published",
    pricing: { basePrice: 2500, currency: "BDT" },
    inventory: { stockLevel: 8, lowStockThreshold: 2, trackQuantity: true, status: "in_stock" },
    media: [{ id: "m15", type: "image", url: "/assets/accessory-pearl-choker.png", alt: "Pearl Choker", isThumbnail: true }],
    tags: ["jewelry", "wedding", "gold"]
  },
  {
    id: "p16",
    name: "Velvet Potli Bag",
    slug: "velvet-potli-maroon",
    sku: "AC-BG-016",
    category: "Accessories",
    description: "Hand-embroidered maroon velvet potli bag with pearl tassels.",
    status: "published",
    pricing: { basePrice: 1500, currency: "BDT" },
    inventory: { stockLevel: 25, lowStockThreshold: 5, trackQuantity: true, status: "in_stock" },
    media: [{ id: "m16", type: "image", url: "/assets/accessory-velvet-potli.png", alt: "Velvet Potli", isThumbnail: true }],
    tags: ["bag", "traditional", "maroon"]
  },
  {
    id: "p17",
    name: "Oxidized Silver Jhumka",
    slug: "oxidized-silver-jhumka",
    sku: "AC-JW-017",
    category: "Accessories",
    description: "Large statement jhumkas in oxidized silver finish. Lightweight alloy.",
    status: "published",
    pricing: { basePrice: 800, currency: "BDT" },
    inventory: { stockLevel: 50, lowStockThreshold: 10, trackQuantity: true, status: "in_stock" },
    media: [{ id: "m17", type: "image", url: "/assets/accessory-silver-jhumka.png", alt: "Silver Jhumka", isThumbnail: true }],
    tags: ["jewelry", "casual", "silver"]
  }
];

export const CATEGORIES = [
  { name: "New Arrivals", slug: "new-arrivals" },
  { name: "Ready to Wear", slug: "ready-to-wear" },
  { name: "Accessories", slug: "accessories" },
  { name: "Editorial", slug: "editorial" },
];

export interface HeroSlide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  description: string;
}


// Helper for simulation
export async function delay(ms: number = 800) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 1,
    image: "/assets/eid-hero.png",
    title: "Moonlit Silence",
    subtitle: "The Eid 2026 Edit",
    description: "In the stillness of the crescent moon, find the luxury of connection. A collection designed for the quiet moments of celebration."
  },
  {
    id: 2,
    image: "/assets/eid-hero-group.png",
    title: "Legacy of Loom",
    subtitle: "The Eid Heritage Edit",
    description: "Celebrate the hands that weave history. Authentic Katan, Muslin, and Silk for the modern custodian of tradition."
  },
  {
    id: 3,
    image: "/assets/saree-blue-katan.png",
    title: "Royal Weaves",
    subtitle: "Katan Collection",
    description: "The sheen of pure silk, the weight of gold zari. Sarees that carry the grandeur of generations."
  }
];


export interface PhilosophyContent {
  tagline: string;
  headline: {
    line1: string;
    line2: string;
  };
  paragraphs: string[];
  ctaText: string;
  image: string;
  imageAlt: string;
}

export const PHILOSOPHY_CONTENT: PhilosophyContent = {
  tagline: "The Artisan's Prayer",
  headline: {
    line1: "Celebration is found in",
    line2: "the details we share."
  },
  paragraphs: [
    "Eid is more than a holiday; it is a return to what matters. In a chaotic world, we often lose the thread of connection—to our traditions, to our loved ones, and to ourselves.",
    "Rokomferi weaves that thread back together. Our Eid edit is not just clothing; it is a vessel for these sacred moments. Soft against the skin, rich in history, and quiet in its luxury, allowing you to be the centerpiece of your own story."
  ],
  ctaText: "Explore the Eid Edit",
  image: "/assets/eid-philosophy.png",
  imageAlt: "Artisan hands weaving gold thread"
};

export interface EditorialContent {
  tagline: string;
  title: string;
  description: string;
  image: string;
}

export const EDITORIAL_CONTENT: EditorialContent = {
  tagline: "The Gathering",
  title: "Stitching Memories",
  description: "A tribute to the warmth of community. Our Heritage Collection is designed for the golden hours of reunion.",
  image: "/assets/eid-editorial.png"
};

// API Simulations
export interface SiteConfig {
  name: string;
  description: string;
  logo: string;
  copyright: string;
  contact: {
    email: string;
    phone: string;
    address: string;
  };
  socials: { platform: string; url: string }[];
}

export const SITE_CONFIG: SiteConfig = {
  name: "Rokomferi",
  description: "Defining quiet luxury through texture, form, and timeless restraint. Designed for the modern sophisticate.",
  logo: "/assets/logo_rokomferi.png",
  copyright: "© 2026 Rokomferi. All rights reserved.",
  contact: {
    email: "concierge@rokomferi.com",
    phone: "+1 (555) 000-0000",
    address: "123 Fashion Ave, New York, NY 10001"
  },
  socials: [
    { platform: "Instagram", url: "#" },
    { platform: "Pinterest", url: "#" },
    { platform: "Twitter", url: "#" }
  ]
};

export async function getSiteConfig(): Promise<SiteConfig> {
  await delay(200);
  return SITE_CONFIG;
}

export async function getEditorialContent(): Promise<EditorialContent> {
  await delay(300);
  return EDITORIAL_CONTENT;
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

export const FOOTER_SECTIONS: FooterSection[] = [
  {
    title: "Shop",
    links: [
      { label: "New Arrivals", href: "/new-arrivals" },
      { label: "Ready to Wear", href: "/category/ready-to-wear" },
      { label: "Accessories", href: "/category/women-accessories" },
      { label: "Editorial", href: "/editorial" }
    ]
  },
  {
    title: "Support",
    links: [
      { label: "Contact Us", href: "/contact" },
      { label: "Shipping & Returns", href: "/shipping" },
      { label: "Size Guide", href: "/size-guide" },
      { label: "FAQ", href: "/faq" }
    ]
  },
  {
    title: "Legal", 
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" }
    ]
  }
];

export async function getFooterSections(): Promise<FooterSection[]> {
  await delay(200);
  return FOOTER_SECTIONS;
}

export async function getPhilosophyContent(): Promise<PhilosophyContent> {
  await delay(300);
  return PHILOSOPHY_CONTENT;
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  await delay();
  return PRODUCTS.find((p) => p.slug === slug);
}

export async function getAllProducts(): Promise<Product[]> {
  await delay(600);
  return PRODUCTS;
}

export async function getHeroSlides(): Promise<HeroSlide[]> {
  await delay(400); 
  return HERO_SLIDES;
}

export async function getCategoryTree(): Promise<CategoryNode[]> {
  await delay(300);
  return CATEGORY_TREE;
}

export interface CollectionInfo {
  title: string;
  description: string;
  image: string;
  story?: string; 
}

const COLLECTIONS_INFO: Record<string, CollectionInfo> = {
  "eid-2026": {
    title: "The Eid Edit",
    description: "A curation of silence, heritage, and golden hour memories.",
    image: "/assets/eid-hero-group.png",
    story: "Eid is a return to the roots. Amidst the chaos of the modern world, we seek the sanctuary of tradition. The Eid 2026 collection is an ode to the soft rustle of silk, the weight of heritage jewelry, and the warmth of family laughter in the courtyard."
  },
  "wedding-guest": {
    title: "Wedding Guest",
    description: "For the moments that mark new beginnings.",
    image: "/assets/saree-blue-katan.png"
  },
  "heritage": {
      title: "Heritage & Heirloom",
      description: "Investing in pieces that will outlast us.",
      image: "/assets/eid-texture.png",
      story: "We believe in the concept of the 'Forever Wardrobe'. These are not just garments; they are assets. Woven with techniques preserved by families for centuries, each piece in the Heritage collection is a testament to the resilience of beauty."
  }
};

export async function getCollectionInfo(slug: string): Promise<CollectionInfo | undefined> {
  await delay(200);
  return COLLECTIONS_INFO[slug];
}

export async function getProductsByCollection(slug: string): Promise<Product[]> {
    await delay(500);
    // In a real app, products would have a 'collections' array or we'd filter by category deeply
    // For this mock, we'll return a mix of relevant products based on the slug
    if (slug === 'eid-2026' || slug === 'heritage') {
        return PRODUCTS; // Return all ethnic products for now
    }
    return [];
}

export interface FeaturedCategory {
  id: string;
  name: string;
  slug: string;
  image: string;
  description?: string;
  size: "large" | "small";
}

export const FEATURED_CATEGORIES: FeaturedCategory[] = [
  {
    id: "fc1",
    name: "Katan Sarees",
    slug: "sarees-katan",
    image: "/assets/saree-blue-katan.png",
    description: "The queen of silks. Woven for grandeur.",
    size: "large"
  },
  {
    id: "fc2",
    name: "Salwar Kameez",
    slug: "salwar-kameez",
    image: "/assets/threepiece-peach.png",
    size: "small"
  },
  {
    id: "fc3",
    name: "Designer Kurtis",
    slug: "kurtis",
    image: "/assets/kurti-emerald.png",
    size: "small"
  }
];

export async function searchProducts(query: string): Promise<Product[]> {
  await delay(500); 
  if (!query) return [];
  const lowerQuery = query.toLowerCase();
  return PRODUCTS.filter(p => 
    p.name.toLowerCase().includes(lowerQuery) || 
    p.category.toLowerCase().includes(lowerQuery) ||
    p.description.toLowerCase().includes(lowerQuery)
  );
}

export async function getFeaturedCategories(): Promise<FeaturedCategory[]> {
  await delay(400);
  return FEATURED_CATEGORIES;
}

// ------------------------------------------------------------------
// NEW: Order Management Service (API Simulation)
// ------------------------------------------------------------------

export interface OrderItem {
  productId: string;
  variantId?: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

export interface Order {
  id: string;
  date: string;
  status: "pending_payment" | "processing" | "shipped" | "delivered" | "cancelled";
  total: number;
  items: OrderItem[];
  paymentMethod: "cod" | "sslcommerz";
  trackingNumber?: string;
  timeline: { status: string; time: string; description: string }[];
}

export const MOCK_ORDERS: Order[] = [
  {
    id: "ORD-2025-8832",
    date: "2025-12-10T14:30:00Z",
    status: "delivered",
    total: 12500,
    paymentMethod: "cod",
    items: [
      { productId: "p1", name: "Royal Blue Katan Silk", quantity: 1, price: 12500, image: "/assets/saree-blue-katan.png" }
    ],
    timeline: [
      { status: "placed", time: "2025-12-10T14:30:00Z", description: "Order placed successfully" },
      { status: "processing", time: "2025-12-10T16:00:00Z", description: "Seller is preparing your order" },
      { status: "shipped", time: "2025-12-11T10:00:00Z", description: "Handed over to logistics partner" },
      { status: "delivered", time: "2025-12-12T11:00:00Z", description: "Package delivered to customer" }
    ]
  },
  {
    id: "ORD-2026-0041",
    date: "2026-01-05T09:15:00Z",
    status: "processing",
    total: 8500,
    paymentMethod: "sslcommerz",
    trackingNumber: "TRK-9928-XA",
    items: [
      { productId: "p2", name: "Peach Organza Luxe Suit", quantity: 1, price: 8500, image: "/assets/threepiece-peach.png" }
    ],
    timeline: [
      { status: "placed", time: "2026-01-05T09:15:00Z", description: "Payment confirmed via SSLCommerz" },
      { status: "processing", time: "2026-01-05T09:20:00Z", description: "Order confirmed, preparing for dispatch" }
    ]
  }
];

export async function getUserOrders(): Promise<Order[]> {
  await delay(800); // Simulate heavier DB call
  return MOCK_ORDERS;
}

export async function getOrderById(id: string): Promise<Order | undefined> {
  await delay(500);
  return MOCK_ORDERS.find(o => o.id === id);
}

// ------------------------------------------------------------------
// NEW: Filter & Metadata Service
// ------------------------------------------------------------------

export interface FilterMetadata {
  priceRange: { min: number; max: number };
  colors: string[];
  sizes: string[];
  categories: { slug: string; name: string; count: number }[];
}

export async function getFilterMetadata(categorySlug?: string): Promise<FilterMetadata> {
  await delay(300);
  // In a real app, this would aggregate based on the category
  return {
    priceRange: { min: 1500, max: 45000 },
    colors: ["Royal Blue", "Peach", "Emerald Green", "White", "Midnight Blue", "Gold"],
    sizes: ["S", "M", "L", "XL", "Unstitched"],
    categories: [
       { slug: "sarees", name: "Sarees", count: 12 },
       { slug: "kurtis", name: "Kurtis", count: 8 },
       { slug: "salwar-kameez", name: "Salwar Kameez", count: 15 }
    ]
  };
}

// ------------------------------------------------------------------
// NEW: Marketing & Newsletter
// ------------------------------------------------------------------

export async function subscribeToNewsletter(email: string): Promise<{ success: boolean; message: string }> {
  await delay(1000); // Simulate API latency
  if (email.includes("error")) return { success: false, message: "Subscription failed. Please try again." };
  return { success: true, message: "Welcome to the circle. You are now subscribed." };
}

export async function submitContactForm(data: any): Promise<{ success: boolean }> {
  await delay(1200);
  console.log("Contact Form Data:", data);
  return { success: true };
}
