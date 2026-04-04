import type { Metadata } from "next";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { VideoCard } from "@/components/ui/video-card";
import { VideoSearchFilter } from "./search-filter";

export const metadata: Metadata = {
  title: "Videos",
  description:
    "Watch OPM fingerstyle guitar performances from talented Filipino artists.",
};

interface Props {
  searchParams: Promise<{ q?: string; artist?: string }>;
}

export default async function VideosPage({ searchParams }: Props) {
  const { q, artist } = await searchParams;
  const supabase = await createClient();

  // Fetch videos
  let query = supabase
    .from("guitarist_videos")
    .select(`
      id,
      slug,
      youtube_url,
      title,
      thumbnail_url,
      guitarist_id,
      created_at,
      guitarists!inner (
        slug,
        display_name,
        approval_status
      )
    `)
    .order("created_at", { ascending: false });

  if (q) {
    query = query.ilike("title", `%${q}%`);
  }

  const { data: videos } = await query;

  let approvedVideos = videos?.filter(
    (v) => (v.guitarists as { approval_status: string } | null)?.approval_status === "approved"
  );

  // Filter by artist slug
  if (artist && approvedVideos) {
    approvedVideos = approvedVideos.filter(
      (v) => (v.guitarists as { slug: string } | null)?.slug === artist
    );
  }

  // Get unique artists for filter dropdown
  const artistMap = new Map<string, string>();
  videos?.forEach((v) => {
    const g = v.guitarists as { slug: string; display_name: string; approval_status: string } | null;
    if (g?.approval_status === "approved") {
      artistMap.set(g.slug, g.display_name);
    }
  });
  const artists = Array.from(artistMap.entries()).map(([slug, display_name]) => ({
    slug,
    display_name,
  })).sort((a, b) => a.display_name.localeCompare(b.display_name));

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Videos
        </h1>
        <p className="mt-2 text-lg text-muted">
          Watch OPM fingerstyle guitar performances.
        </p>
      </div>

      <Suspense>
        <VideoSearchFilter artists={artists} />
      </Suspense>

      {approvedVideos && approvedVideos.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {approvedVideos.map((video) => {
            const g = video.guitarists as { slug: string; display_name: string } | null;
            return (
              <VideoCard
                key={video.id}
                video={video}
                guitaristName={g?.display_name}
                guitaristSlug={g?.slug}
              />
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-surface px-6 py-16 text-center">
          <p className="text-lg text-muted">
            {q || artist ? "No videos found matching your search." : "No videos available yet."}
          </p>
        </div>
      )}
    </div>
  );
}
