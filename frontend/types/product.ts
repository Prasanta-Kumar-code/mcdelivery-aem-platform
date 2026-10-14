export interface Product {
  _path?: string;
  title: string;
  sku: string;
  price: number;
  currency?: string;
  category: string;
  isVeg: boolean;
  description?: string;
  allergens?: string;
  availability?: string;
  displayOrder?: number;
  isActive?: boolean;
  image?: {
    _path: string;
  };
}