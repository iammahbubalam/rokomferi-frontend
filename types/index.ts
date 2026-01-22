// AI/SEO Optimization Types
export interface ProductSpecs {
  [key: string]: string; // e.g., { "RAM": "8GB", "Storage": "128GB", "Battery": "5000mAh" }
}

export interface ProductFAQ {
  question: string;
  answer: string;
}

export interface ProductVerdict {
  summary: string; // Main verdict statement
  pros: string[]; // List of advantages
  cons: string[]; // List of disadvantages
  rating?: number; // Optional 1-5 rating
}

// Analytics/Stats Types
export interface DailySalesStat {
  date: string;
  order_count: number;
  total_revenue: number;
  avg_order_value: number;
}

export interface RevenueKPIs {
  total_orders: number;
  total_revenue: number;
  avg_order_value: number;
  unique_customers: number;
}

export interface LowStockProduct {
  id: string;
  name: string;
  slug: string;
  stock: number;
  base_price: number;
  sale_price?: number;
  sku: string;
  media?: any;
  stock_status: string;
}

export interface TopSellingProduct {
  id: string;
  name: string;
  slug: string;
  basePrice: number;
  salePrice?: number;
  media?: any;
  totalSold: number;
  totalRevenue: number;
}

export interface TopCustomer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  order_count: number;
  lifetime_value: number;
}

export interface CustomerRetention {
  new_customers: number;
  returning_customers: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
  children?: Category[];
  orderIndex?: number;
  icon?: string;
  image?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  showInNav?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  path?: string;
}

export interface Collection {
  id: string;
  title: string;
  slug: string;
  description: string;
  image: string;
  story: string;
  isActive: boolean;
  products?: Product[];
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  ogImage?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  basePrice: number;
  salePrice?: number;
  stock: number;
  stockStatus: "in_stock" | "out_of_stock" | "pre_order";
  images: string[];
  categories: Category[];
  sku: string;
  isActive: boolean;
  isFeatured?: boolean;
  isNew?: boolean;
  lowStockThreshold: number;
  createdAt?: string;
  updatedAt?: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  ogImage?: string;
  // AI/SEO Optimization fields
  specs?: ProductSpecs;
  faqs?: ProductFAQ[];
  verdict?: ProductVerdict;
}

export interface InventoryLog {
  id: number;
  productId: string;
  variantId?: string;
  changeAmount: number;
  reason: string;
  referenceId: string;
  createdAt: string;
}

export interface Review {
  id: string;
  userId: string;
  user: {
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Order {
  id: string;
  status:
    | "pending"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "returned";
  totalAmount: number;
  paymentStatus: string;
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  items: {
    productName: string;
    quantity: number;
    price: number;
  }[];
}
