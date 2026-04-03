import Image from "next/image";
import Link from "next/link";
import type { Guitarist } from "@/lib/supabase/types";

interface GuitaristCardProps {
  guitarist: Pick<Guitarist, "slug" | "display_name" | "location" | "bio_short" | "profile_photo_url">;
}

export function GuitaristCard({ guitarist }: GuitaristCardProps) {
  return (
    <Link
      href={`/guitarists/${guitarist.slug}`}
      className="group overflow-hidden rounded-xl border border-border bg-background transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-200">
        {guitarist.profile_photo_url ? (
          <Image
            src={guitarist.profile_photo_url}
            alt={guitarist.display_name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl text-gray-400">
            <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-foreground group-hover:text-primary">
          {guitarist.display_name}
        </h3>
        {guitarist.location && (
          <p className="mt-0.5 text-sm text-muted">{guitarist.location}</p>
        )}
        <p className="mt-2 line-clamp-2 text-sm text-muted">
          {guitarist.bio_short}
        </p>
      </div>
    </Link>
  );
}
