export interface Category {
  _path?: string;
  title: string;
  slug: string;
  displayOrder: number;
  description?: string;
  isActive?: boolean;
  locale?: string;
}