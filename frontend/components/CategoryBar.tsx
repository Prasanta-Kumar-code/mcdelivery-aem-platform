"use client";

import { Category } from "@/types/category";

export default function CategoryBar({
  categories,
  selectedCategory,
  onSelect,
}: {
  readonly categories: Category[];
  readonly selectedCategory: string;
  readonly onSelect: (slug: string) => void;
}) {
  return (
    <nav aria-label="Menu categories" className="category-bar">
      {categories.map((category) => (
        <button
          key={category.slug}
          type="button"
          onClick={() => onSelect(category.slug)}
          aria-pressed={selectedCategory === category.slug}
          data-active={selectedCategory === category.slug}
          className="category-button"
        >
          {category.title}
        </button>
      ))}
    </nav>
  );
}