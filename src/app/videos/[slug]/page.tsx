import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getYouTubeId } from "@/lib/utils";
import { ReportVideoButton } from "@/components/ui/report-video";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: video } = await supabase
    .from("guitarist_videos")
    .select("title, description, youtube_url, guitarists!inner(display_name, approval_status)")
    .eq("slug", slug)
    .single();

  if (!video) return { title: "Video Not Found" };

  const g = video.guitarists as { display_name: string; approval_status: string } | null;
  const videoTitle = video.title || "Fingerstyle Guitar Cover";
  const metaDesc = video.description
    ? video.description.substring(0, 155)
    : `Watch ${videoTitle} by ${g?.display_name || "a Filipino fingerstyle guitarist"}. OPM fingerstyle guitar cover with tabs available.`;

  return {
    title: `${videoTitle} — ${g?.display_name || "OPM Fingerstyle"}`,
    description: metaDesc,
    openGraph: {
      title: `${videoTitle} | OPM Fingerstyle`,
      description: `Watch ${videoTitle} by ${g?.display_name}`,
      videos: [{ url: video.youtube_url }],
    },
  };
}

export default async function VideoDetailPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: video } = await supabase
    .from("guitarist_videos")
    .select("*, guitarists!inner(id, slug, display_name, youtube_channel_url, profile_photo_url, approval_status)")
    .eq("slug", slug)
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

  // Find tab that matches this video's title
  const videoTitle = video.title || "";
  const [{ data: allTabs }, { data: moreVideos }] = await Promise.all([
    supabase
      .from("tablature_links")
      .select("id, slug, title, song_name, external_url, source_label")
      .eq("guitarist_id", g?.id || ""),
    supabase
      .from("guitarist_videos")
      .select("id, title, slug, youtube_url")
      .eq("guitarist_id", g?.id || "")
      .neq("id", video.id)
      .order("featured_order")
      .limit(3),
  ]);

  // Match tab to this video by title similarity
  const matchingTab = allTabs?.find((tab) => {
    const tabTitle = tab.title.toLowerCase();
    const vTitle = videoTitle.toLowerCase();
    return tabTitle.includes(vTitle) || vTitle.includes(tabTitle) ||
      (tab.song_name && vTitle.includes(tab.song_name.toLowerCase()));
  }) || null;

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
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {youtubeId ? (
            <div className="relative aspect-video overflow-hidden rounded-b-xl">
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
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          {/* Main content */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {video.title || "Fingerstyle Guitar Cover"}
            </h1>

            {/* Genre tags */}
            {video.genre && video.genre.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {video.genre.map((g: string) => (
                  <span
                    key={g}
                    className="rounded-full border border-border px-3 py-0.5 text-xs font-medium text-muted"
                  >
                    {g}
                  </span>
                ))}
              </div>
            )}

            {/* Artist info */}
            <div className="mt-4 flex items-center gap-3">
              {g?.profile_photo_url && (
                <Image
                  src={g.profile_photo_url}
                  alt={g.display_name}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
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

            {/* Description */}
            {video.description && (
              <div className="mt-6 text-muted leading-relaxed">
                {video.description.split("\n").map((paragraph, i) => (
                  <p key={i} className={i > 0 ? "mt-3" : ""}>{paragraph}</p>
                ))}
              </div>
            )}

            {/* Action buttons */}
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={video.youtube_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <path d="M8 5v14l11-7z" fill="currentColor" />
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

          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Tab download */}
            {matchingTab && (
              <div className="rounded-xl border border-border bg-background p-6">
                <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">
                  Get the {video.title || "Guitar"} Tab
                </h2>
                <p className="mt-2 text-sm text-muted">
                  Learn to play this arrangement with accurate guitar tablature.
                </p>
                <Link
                  href={`/tabs/${matchingTab.slug || matchingTab.id}`}
                  className="mt-4 flex w-full items-center justify-center rounded-lg bg-red-600 px-4 py-3 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-red-700"
                >
                  View Tab
                </Link>
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
                    <Image
                      src={g.profile_photo_url}
                      alt={g.display_name}
                      width={48}
                      height={48}
                      className="rounded-full object-cover"
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
              <ReportVideoButton videoId={video.id} />
            </div>
          </aside>
        </div>
      </div>

      {/* More from this artist — full width */}
      {moreVideos && moreVideos.length > 0 && (
        <section className="bg-surface">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-foreground">
              More from {g?.display_name}
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {moreVideos.map((v) => {
                const vId = getYouTubeId(v.youtube_url);
                const vHref = v.slug ? `/videos/${v.slug}` : `/videos/${v.id}`;
                return (
                  <Link
                    key={v.id}
                    href={vHref}
                    className="group overflow-hidden rounded-xl border border-border bg-background transition-shadow hover:shadow-lg"
                  >
                    {vId && (
                      <div className="relative aspect-video overflow-hidden bg-gray-200">
                        <Image
                          src={`https://img.youtube.com/vi/${vId}/mqdefault.jpg`}
                          alt={v.title || "Video"}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/20">
                          <div className="rounded-full bg-white/90 p-3 shadow-lg">
                            <svg className="h-6 w-6 text-foreground" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="line-clamp-2 font-medium text-foreground group-hover:text-primary">
                        {v.title || "Untitled"}
                      </h3>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
