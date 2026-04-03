import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { GearCard } from "@/components/ui/gear-card";
import { GearCategoryFilter } from "./category-filter";

export const metadata: Metadata = {
  title: "Gear & Products",
  description:
    "Explore guitars, accessories, and gear used by Filipino fingerstyle artists.",
};

const categoryLabels: Record<string, string> = {
  acoustic_guitar: "Acoustic Guitars",
  classical_guitar: "Classical Guitars",
  strings: "Strings",
  capo: "Capos",
  tuner: "Tuners",
  pickup: "Pickups",
  microphone: "Microphones",
  audio_interface: "Audio Interfaces",
  amp: "Amps",
  cable: "Cables",
  stand: "Stands",
  accessory: "Accessories",
};

export default async function GearPage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("gear_products")
    .select("slug, name, brand, category, short_description, image_url, sponsored")
    .eq("active", true)
    .order("sponsored", { ascending: false })
    .order("name");

  // Group by category
  const grouped = new Map<string, typeof products>();
  for (const product of products || []) {
    const cat = product.category;
    if (!grouped.has(cat)) grouped.set(cat, []);
    grouped.get(cat)!.push(product);
  }

  const categories = Array.from(grouped.keys()).map((key) => ({
    id: key,
    label: categoryLabels[key] || key,
    count: grouped.get(key)!.length,
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Gear & Products
        </h1>
        <p className="mt-2 text-lg text-muted">
          Explore guitars, accessories, and gear recommended by the community.
        </p>
        <p className="mt-1 text-sm text-muted">
          Some links may be affiliate links.{" "}
          <a href="/affiliate-disclosure" className="text-primary hover:text-primary-hover">
            Learn more
          </a>
        </p>
      </div>

      {grouped.size > 0 ? (
        <>
          <GearCategoryFilter categories={categories} />

          <div className="mt-8 space-y-12">
            {Array.from(grouped.entries()).map(([category, items]) => (
              <section key={category} id={category} className="scroll-mt-32">
                <h2 className="text-2xl font-bold text-foreground">
                  {categoryLabels[category] || category}
                </h2>
                <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {items!.map((product) => (
                    <GearCard key={product.slug} product={product} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </>
      ) : (
        <div className="rounded-xl border border-border bg-surface px-6 py-16 text-center">
          <p className="text-lg text-muted">
            No gear listed yet. Check back soon!
          </p>
        </div>
      )}
    </div>
  );
}
