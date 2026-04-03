import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { GuitaristCard } from "@/components/ui/guitarist-card";

export const metadata: Metadata = {
  title: "Guitarist Directory",
  description:
    "Browse our directory of talented Filipino fingerstyle guitarists performing OPM songs.",
};

export default async function GuitaristsPage() {
  const supabase = await createClient();
  const { data: guitarists } = await supabase
    .from("guitarists")
    .select("slug, display_name, location, bio_short, profile_photo_url")
    .eq("approval_status", "approved")
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

      {guitarists && guitarists.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {guitarists.map((guitarist) => (
            <GuitaristCard key={guitarist.slug} guitarist={guitarist} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-surface px-6 py-16 text-center">
          <p className="text-lg text-muted">
            No guitarists listed yet. Be the first!
          </p>
          <a
            href="/submit"
            className="mt-4 inline-flex items-center rounded-full bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-primary-hover"
          >
            Submit Your Profile
          </a>
        </div>
      )}
    </div>
  );
}
