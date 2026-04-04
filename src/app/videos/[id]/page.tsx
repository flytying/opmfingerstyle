import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getYouTubeId } from "@/lib/utils";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();

  const { data: video } = await supabase
    .from("guitarist_videos")
    .select("title, youtube_url, guitarists!inner(display_name, approval_status)")
    .eq("id", id)
    .single();

  if (!video) return { title: "Video Not Found" };

  const g = video.guitarists as { display_name: string; approval_status: string } | null;
  const videoTitle = video.title || "Fingerstyle Guitar Cover";

  return {
    title: `${videoTitle} — ${g?.display_name || "OPM Fingerstyle"}`,
    description: `Watch ${videoTitle} by ${g?.display_name || "a Filipino fingerstyle guitarist"}. OPM fingerstyle guitar cover with tabs available.`,
    openGraph: {
      title: `${videoTitle} | OPM Fingerstyle`,
      description: `Watch ${videoTitle} by ${g?.display_name}`,
      videos: [{ url: video.youtube_url }],
    },
  };
}

export default async function VideoDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: video } = await supabase
    .from("guitarist_videos")
    .select("*, guitarists!inner(id, slug, display_name, youtube_channel_url, profile_photo_url, approval_status)")
    .eq("id", id)
    .single();

  if (!video) notFound();

  const g = video.guitarists as {
    id: string;
    slug: string;
    display_name: string;
    youtube_channel_url: string | null;
    profile_photo_url: string | null;
    approval_status: string;
  } | null;

  if (g?.approval_status !== "approved") notFound();

  const youtubeId = getYouTubeId(video.youtube_url);

  // Get related tabs from this guitarist
  const { data: tabs } = await supabase
    .from("tablature_links")
    .select("id, title, song_name, external_url, source_label")
    .eq("guitarist_id", g?.id || "")
    .order("created_at", { ascending: false })
    .limit(5);

  // Get more videos from this guitarist (excluding current)
  const { data: moreVideos } = await supabase
    .from("guitarist_videos")
    .select("id, title, youtube_url")
    .eq("guitarist_id", g?.id || "")
    .neq("id", id)
    .order("featured_order")
    .limit(4);

  // JSON-LD for VideoObject
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: video.title || "Fingerstyle Guitar Cover",
    description: `${video.title || "Fingerstyle guitar cover"} by ${g?.display_name}`,
    thumbnailUrl: youtubeId ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg` : undefined,
    uploadDate: video.created_at,
    contentUrl: video.youtube_url,
    embedUrl: youtubeId ? `https://www.youtube.com/embed/${youtubeId}` : undefined,
    author: {
      "@type": "Person",
      name: g?.display_name,
      url: `https://opmfingerstyle.com/guitarists/${g?.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Video Hero */}
      <section className="bg-gray-900">
        <div className="mx-auto max-w-5xl">
          {youtubeId ? (
            <div className="relative aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${youtubeId}?rel=0`}
                title={video.title || "Video"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          ) : (
            <div className="flex aspect-video items-center justify-center">
              <a
                href={video.youtube_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg text-white underline"
              >
                Watch on YouTube
              </a>
            </div>
          )}
        </div>
      </section>

      {/* Content */}
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          {/* Main content */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {video.title || "Fingerstyle Guitar Cover"}
            </h1>

            {/* Artist info */}
            <div className="mt-4 flex items-center gap-3">
              {g?.profile_photo_url && (
                <img
                  src={g.profile_photo_url}
                  alt={g.display_name}
                  className="h-10 w-10 rounded-full object-cover"
                />
              )}
              <div>
                <Link
                  href={`/guitarists/${g?.slug}`}
                  className="font-medium text-foreground hover:text-primary"
                >
                  {g?.display_name}
                </Link>
                <p className="text-sm text-muted">Fingerstyle Guitarist</p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={video.youtube_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814Z" />
                  <path fill="#fff" d="M9.545 15.568V8.432L15.818 12l-6.273 3.568Z" />
                </svg>
                Watch on YouTube
              </a>
              {g?.youtube_channel_url && (
                <a
                  href={g.youtube_channel_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface"
                >
                  Subscribe to Channel
                </a>
              )}
            </div>

            {/* More videos from this artist */}
            {moreVideos && moreVideos.length > 0 && (
              <div className="mt-10">
                <h2 className="text-xl font-bold text-foreground">
                  More from {g?.display_name}
                </h2>
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {moreVideos.map((v) => {
                    const vId = getYouTubeId(v.youtube_url);
                    return (
                      <Link
                        key={v.id}
                        href={`/videos/${v.id}`}
                        className="group flex gap-3 rounded-lg border border-border p-3 transition-colors hover:border-primary hover:bg-primary-light"
                      >
                        {vId && (
                          <img
                            src={`https://img.youtube.com/vi/${vId}/mqdefault.jpg`}
                            alt={v.title || "Video"}
                            className="h-16 w-28 shrink-0 rounded object-cover"
                          />
                        )}
                        <p className="line-clamp-2 text-sm font-medium text-foreground group-hover:text-primary">
                          {v.title || "Untitled"}
                        </p>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Tabs download */}
            {tabs && tabs.length > 0 && (
              <div className="rounded-xl border border-border bg-surface p-6">
                <h2 className="font-bold text-foreground">
                  Guitar Tabs
                </h2>
                <p className="mt-1 text-sm text-muted">
                  Learn to play this arrangement with accurate tablature.
                </p>
                <div className="mt-4 space-y-2">
                  {tabs.map((tab) => (
                    <a
                      key={tab.id}
                      href={tab.external_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
                    >
                      <span>{tab.title}</span>
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Guitarist profile card */}
            <div className="rounded-xl border border-border p-6">
              <h2 className="font-bold text-foreground">About the Artist</h2>
              <div className="mt-4">
                <Link
                  href={`/guitarists/${g?.slug}`}
                  className="flex items-center gap-3 hover:opacity-80"
                >
                  {g?.profile_photo_url && (
                    <img
                      src={g.profile_photo_url}
                      alt={g.display_name}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <p className="font-medium text-foreground">{g?.display_name}</p>
                    <p className="text-sm text-primary">View Profile &rarr;</p>
                  </div>
                </Link>
              </div>
              {g?.youtube_channel_url && (
                <a
                  href={g.youtube_channel_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex w-full items-center justify-center rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface"
                >
                  YouTube Channel
                </a>
              )}
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
