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
  lowStockThreshold: number;
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
