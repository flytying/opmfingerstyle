import Image from "next/image";
import Link from "next/link";
import type { GearProduct } from "@/lib/supabase/types";

interface GearCardProps {
  product: Pick<GearProduct, "slug" | "name" | "brand" | "category" | "short_description" | "image_url" | "sponsored">;
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

export function GearCard({ product }: GearCardProps) {
  return (
    <Link
      href={`/gear/${product.slug}`}
      className="group overflow-hidden rounded-xl border border-border bg-background transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">
            <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m9 9 10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 0 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 9 15.553Z" />
            </svg>
          </div>
        )}
        {product.sponsored && (
          <span className="absolute right-2 top-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
            Sponsored
          </span>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs font-medium uppercase tracking-wider text-muted">
          {product.brand ? `${product.brand} · ` : ""}{categoryLabels[product.category] || product.category}
        </p>
        <h3 className="mt-1 font-semibold text-foreground group-hover:text-primary">
          {product.name}
        </h3>
        {product.short_description && (
          <p className="mt-2 line-clamp-2 text-sm text-muted">
            {product.short_description}
          </p>
        )}
      </div>
    </Link>
  );
}
