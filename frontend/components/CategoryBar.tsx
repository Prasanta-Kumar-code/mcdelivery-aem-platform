"use client";

import { Category } from "@/types/category";

export default function CategoryBar({
  categories,
  selectedCategory,
}: {
  readonly categories: Category[];
  readonly selectedCategory: string;
}) {
  return (
    <nav aria-label="Menu categories" className="category-bar">
      {categories.map((category) => {
        const active = selectedCategory === category.slug;
        const href = category.slug === "all" ? "/" : `/?category=${category.slug}`;

        return (
          <a
            key={category.slug}
            className="category-button"
            href={href}
            aria-current={active ? "true" : undefined}
            data-active={active}

          >
            {category.title}
          </a>
        );
      })}
    </nav>
  );
}