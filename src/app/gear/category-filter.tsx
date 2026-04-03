"use client";

import { useState } from "react";

interface Category {
  id: string;
  label: string;
  count: number;
}

export function GearCategoryFilter({ categories }: { categories: Category[] }) {
  const [active, setActive] = useState<string | null>(null);

  function handleClick(id: string) {
    setActive(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function handleAll() {
    setActive(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="sticky top-16 z-40 -mx-4 overflow-x-auto border-b border-border bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <div className="flex gap-2">
        <button
          onClick={handleAll}
          className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            active === null
              ? "bg-foreground text-background"
              : "bg-gray-100 text-muted hover:bg-gray-200"
          }`}
        >
          All ({categories.reduce((sum, c) => sum + c.count, 0)})
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleClick(cat.id)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              active === cat.id
                ? "bg-foreground text-background"
                : "bg-gray-100 text-muted hover:bg-gray-200"
            }`}
          >
            {cat.label} ({cat.count})
          </button>
        ))}
      </div>
    </div>
  );
}
