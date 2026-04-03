import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { VideoCard } from "@/components/ui/video-card";

export const metadata: Metadata = {
  title: "Videos",
  description:
    "Watch OPM fingerstyle guitar performances from talented Filipino artists.",
};

export default async function VideosPage() {
  const supabase = await createClient();

  const { data: videos } = await supabase
    .from("guitarist_videos")
    .select(`
      id,
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

  const approvedVideos = videos?.filter(
    (v) => (v.guitarists as { approval_status: string } | null)?.approval_status === "approved"
  );

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
          <p className="text-lg text-muted">No videos available yet.</p>
        </div>
      )}
    </div>
  );
}
