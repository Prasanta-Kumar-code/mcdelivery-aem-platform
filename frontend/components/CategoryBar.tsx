"use client";

import { Category } from "@/types/category";

export default function CategoryBar({
  categories,
  selectedCategory,
  onSelectCategory,
}: {
  readonly categories: Category[];
  readonly selectedCategory: string;
  readonly onSelectCategory: (category: string) => void;
}) {
  return (
    <nav aria-label="Menu categories" className="category-bar">
      {categories.map((category) => {
        const active = selectedCategory === category.slug;
        return (
          <button
            key={category.slug}
            type="button"
            className="category-button"
            aria-current={active ? "true" : undefined}
            data-active={active}
            onClick={() => onSelectCategory(category.slug)}
          >
            {category.title}
          </button>
        );
      })}
    </nav>
  );
}