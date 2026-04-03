import type { Metadata } from "next";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { GuitaristCard } from "@/components/ui/guitarist-card";
import { SearchBar } from "./search-bar";

export const metadata: Metadata = {
  title: "Guitarist Directory",
  description:
    "Browse our directory of talented Filipino fingerstyle guitarists performing OPM songs.",
};

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export default async function GuitaristsPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("guitarists")
    .select("slug, display_name, location, bio_short, profile_photo_url")
    .eq("approval_status", "approved");

  if (q) {
    query = query.or(`display_name.ilike.%${q}%,location.ilike.%${q}%`);
  }

  const { data: guitarists } = await query
    .order("featured", { ascending: false })
    .order("display_name");

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Guitarist Directory
        </h1>
        <p className="mt-2 text-lg text-muted">
          Discover talented Filipino fingerstyle guitarists performing OPM
          songs.
        </p>
      </div>

      <div className="mb-8 max-w-md">
        <Suspense>
          <SearchBar />
        </Suspense>
      </div>

      {guitarists && guitarists.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {guitarists.map((guitarist) => (
            <GuitaristCard key={guitarist.slug} guitarist={guitarist} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-surface px-6 py-16 text-center">
          <p className="text-lg text-muted">
            {q ? `No guitarists found for "${q}".` : "No guitarists listed yet. Be the first!"}
          </p>
          {!q && (
            <a
              href="/submit"
              className="mt-4 inline-flex items-center rounded-full bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-primary-hover"
            >
              Submit Your Profile
            </a>
          )}
        </div>
      )}
    </div>
  );
}
