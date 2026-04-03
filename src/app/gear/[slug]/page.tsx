import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { gearProductJsonLd } from "@/lib/structured-data";

interface Props {
  params: Promise<{ slug: string }>;
}

const categoryLabels: Record<string, string> = {
  acoustic_guitar: "Acoustic Guitar",
  classical_guitar: "Classical Guitar",
  strings: "Strings",
  capo: "Capo",
  tuner: "Tuner",
  pickup: "Pickup",
  microphone: "Microphone",
  audio_interface: "Audio Interface",
  amp: "Amp",
  cable: "Cable",
  stand: "Stand",
  accessory: "Accessory",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: product } = await supabase
    .from("gear_products")
    .select("name, short_description, image_url")
    .eq("slug", slug)
    .eq("active", true)
    .single();

  if (!product) return { title: "Product Not Found" };

  return {
    title: product.name,
    description: product.short_description || `${product.name} — gear for fingerstyle guitarists.`,
    openGraph: {
      images: product.image_url ? [product.image_url] : [],
    },
  };
}

export default async function GearDetailPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("gear_products")
    .select("*")
    .eq("slug", slug)
    .eq("active", true)
    .single();

  if (!product) notFound();

  const buyUrl = product.affiliate_url || product.external_url;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(gearProductJsonLd(product)) }}
      />
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <nav className="mb-8 text-sm text-muted">
        <Link href="/gear" className="hover:text-primary">
          Gear
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden rounded-xl border border-border bg-gray-50">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-contain p-8"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-400">
              <svg className="h-24 w-24" fill="none" viewBox="0 0 24 24" strokeWidth={0.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m9 9 10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 0 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 9 15.553Z" />
              </svg>
            </div>
          )}
          {product.sponsored && (
            <span className="absolute right-3 top-3 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
              Sponsored
            </span>
          )}
        </div>

        {/* Details */}
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-muted">
            {product.brand ? `${product.brand} · ` : ""}
            {categoryLabels[product.category] || product.category}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">
            {product.name}
          </h1>

          {product.short_description && (
            <p className="mt-4 text-lg leading-relaxed text-muted">
              {product.short_description}
            </p>
          )}

          {buyUrl && (
            <a
              href={buyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
            >
              View Product &rarr;
            </a>
          )}

          {product.affiliate_url && (
            <p className="mt-3 text-xs text-muted">
              This is an affiliate link.{" "}
              <Link href="/affiliate-disclosure" className="text-primary hover:text-primary-hover">
                Learn more
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
    </>
  );
}
