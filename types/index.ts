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
}

export interface Product {
    id: string;
    name: string;
    slug: string;
    description: string;
    basePrice: number;
    salePrice?: number;
    stock: number;
    stockStatus: 'in_stock' | 'out_of_stock' | 'pre_order';
    images: string[];
    categoryId: string;
    category?: Category;
    sku: string;
    isActive: boolean;
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
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
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
