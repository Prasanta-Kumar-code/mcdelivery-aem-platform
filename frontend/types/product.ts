export interface Product {
  title: string;
  sku: string;
  price: number;
  category: string;
  isVeg: boolean;

  description: {
    plaintext: string;
  };

  image?: {
    _path: string;
  };
}