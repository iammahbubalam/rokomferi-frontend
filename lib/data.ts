export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  category: string;
  description: string;
  images: string[];
  inStock: boolean;
  isNew: boolean;
}

export interface CategoryNode {
  id: string;
  name: string;
  slug: string;
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
        name: "Clothing",
        slug: "women-clothing",
        children: [
           { id: "c1-1-1", name: "Dresses", slug: "dresses" },
           { id: "c1-1-2", name: "Tops & Tunics", slug: "tops-tunics" },
           { id: "c1-1-3", name: "Outerwear", slug: "outerwear" },
           { id: "c1-1-4", name: "Sarees (Katan)", slug: "sarees-katan" },
        ]
      },
      {
        id: "c1-2",
        name: "Accessories",
        slug: "women-accessories",
        children: [
           { id: "c1-2-1", name: "Bags", slug: "bags" },
           { id: "c1-2-2", name: "Jewelry", slug: "jewelry" },
        ]
      }
    ]
  },
  {
    id: "c2",
    name: "Collections",
    slug: "collections",
    children: [
      { id: "c2-1", name: "Eid 2026", slug: "eid-2026" },
      { id: "c2-2", name: "Wedding Guest", slug: "wedding-guest" },
      { id: "c2-3", name: "Office Wear", slug: "office-wear" }
    ]
  }
];

export const PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Obsidian Silk Tunic",
    slug: "obsidian-silk-tunic",
    price: 350,
    category: "Tops",
    description: "A handcrafted pure silk tunic featuring a relaxed silhouette and deep midnight resonance. Designed for breathable elegance.",
    images: ["/assets/silk-tunic.png"],
    inStock: true,
    isNew: true,
  },
  {
    id: "p2",
    name: "Alabaster Wool Coat",
    slug: "alabaster-wool-coat",
    price: 890,
    category: "Outerwear",
    description: "Italian wool blend coat in a soft alabaster shade. Architectural cut with minimal detailing.",
    images: ["/assets/wool-coat.png"],
    inStock: true,
    isNew: false,
  },
  {
    id: "p3",
    name: "Muted Bronze Pleated Skirt",
    slug: "muted-bronze-pleated-skirt",
    price: 420,
    category: "Bottoms",
    description: "High-waisted pleated skirt in our signature metallic-sheen fabric. Moves like liquid gold.",
    images: ["/assets/bronze-skirt.png"],
    inStock: true,
    isNew: true,
  },
  {
    id: "p4",
    name: "Sage Mist Cashmere Wrap",
    slug: "sage-mist-cashmere-wrap",
    price: 280,
    category: "Accessories",
    description: "Ethically sourced cashmere in a calming sage green. Perfect for transitional weather.",
    images: ["https://placehold.co/600x800/8C9688/FFFFFF/png?text=Sage+Wrap"],
    inStock: true,
    isNew: false,
  },
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

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 1,
    image: "/assets/hero-banner.png",
    title: "Silence is Luxury",
    subtitle: "Spring / Summer 2026",
    description: "Discover the power of restraint with our new collection of breathable organics."
  },
  {
    id: 2,
    image: "/assets/silk-tunic.png",
    title: "Midnight Silk",
    subtitle: "The Evening Edit",
    description: "Handcrafted pure silk tunics designed for elegance in motion."
  },
  {
    id: 3,
    image: "/assets/wool-coat.png",
    title: "Architectural Wool",
    subtitle: "Winter Structure",
    description: "Italian blends featuring minimal cuts and uncompromising warmth."
  },
  {
    id: 4,
    image: "/assets/bronze-skirt.png",
    title: "Liquid Bronze",
    subtitle: "Statement Pieces",
    description: "Metallic sheen pleats that capture every glimmer of light."
  }
];

// Simulation of API Latency
export async function delay(ms: number = 800) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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
  await delay(400); // Simulate faster fetch for hero
  return HERO_SLIDES;
}

export async function getCategoryTree(): Promise<CategoryNode[]> {
  await delay(300);
  return CATEGORY_TREE;
}

export async function searchProducts(query: string): Promise<Product[]> {
  await delay(500); // Simulate network latency
  if (!query) return [];
  const lowerQuery = query.toLowerCase();
  return PRODUCTS.filter(p => 
    p.name.toLowerCase().includes(lowerQuery) || 
    p.category.toLowerCase().includes(lowerQuery) ||
    p.description.toLowerCase().includes(lowerQuery)
  );
}
