import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getYouTubeId } from "@/lib/utils";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: tab } = await supabase
    .from("tablature_links")
    .select("title, song_name, guitarists!inner(display_name, approval_status)")
    .or(`slug.eq.${slug},id.eq.${slug}`)
    .limit(1)
    .single();

  if (!tab) return { title: "Tab Not Found" };

  const g = tab.guitarists as { display_name: string; approval_status: string } | null;
  const title = tab.title || "Guitar Tab";

  return {
    title: `${title} — ${g?.display_name || "OPM Fingerstyle"} | OPM Fingerstyle Tabs`,
    description: `Get the fingerstyle guitar tab for ${title}${tab.song_name ? ` (${tab.song_name})` : ""} by ${g?.display_name || "a Filipino fingerstyle guitarist"}.`,
    openGraph: {
      title: `${title} | OPM Fingerstyle Tabs`,
      description: `Fingerstyle guitar tab for ${title} by ${g?.display_name}`,
    },
  };
}

export default async function TabDetailPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: tab } = await supabase
    .from("tablature_links")
    .select("*, guitarists!inner(id, slug, display_name, youtube_channel_url, profile_photo_url, approval_status)")
    .or(`slug.eq.${slug},id.eq.${slug}`)
    .limit(1)
    .single();

  if (!tab) notFound();

  const g = tab.guitarists as {
    id: string;
    slug: string;
    display_name: string;
    youtube_channel_url: string | null;
    profile_photo_url: string | null;
    approval_status: string;
  } | null;

  if (g?.approval_status !== "approved") notFound();

  // Find matching video and more tabs from same artist in parallel
  const [{ data: videos }, { data: moreTabs }] = await Promise.all([
    supabase
      .from("guitarist_videos")
      .select("id, title, slug, youtube_url, description, genre")
      .eq("guitarist_id", g?.id || ""),
    supabase
      .from("tablature_links")
      .select("id, slug, title, song_name, source_label")
      .eq("guitarist_id", g?.id || "")
      .neq("id", tab.id)
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  // Match video to this tab by title similarity
  const tabTitle = tab.title.toLowerCase();
  const matchingVideo = videos?.find((v) => {
    const vTitle = (v.title || "").toLowerCase();
    return vTitle.includes(tabTitle) || tabTitle.includes(vTitle) ||
      (tab.song_name && vTitle.includes(tab.song_name.toLowerCase()));
  }) || null;

  const youtubeId = matchingVideo ? getYouTubeId(matchingVideo.youtube_url) : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: tab.title,
    description: `Fingerstyle guitar tab for ${tab.title}${tab.song_name ? ` (${tab.song_name})` : ""}`,
    author: {
      "@type": "Person",
      name: g?.display_name,
      url: `https://opmfingerstyle.com/guitarists/${g?.slug}`,
    },
    url: `https://opmfingerstyle.com/tabs/${tab.slug || tab.id}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-muted">
          <Link href="/tabs" className="hover:text-primary">Tabs</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{tab.title}</span>
        </nav>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          {/* Main content */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {tab.title}
            </h1>

            {/* Meta info */}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              {tab.song_name && (
                <span className="text-muted">
                  Song: <span className="font-medium text-foreground">{tab.song_name}</span>
                </span>
              )}
              {tab.source_label && (
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-muted">
                  {tab.source_label}
                </span>
              )}
            </div>

            {/* Artist info */}
            <div className="mt-5 flex items-center gap-3">
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

            {/* CTA Button */}
            <div className="mt-8">
              <a
                href={tab.external_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-primary-hover"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
                View Tab{tab.source_label ? ` on ${tab.source_label}` : ""}
              </a>
            </div>

            {/* Matching Video */}
            {matchingVideo && youtubeId && (
              <div className="mt-10">
                <h2 className="text-xl font-bold text-foreground">
                  Watch the Performance
                </h2>
                <p className="mt-1 text-sm text-muted">
                  See how {g?.display_name} plays this arrangement.
                </p>
                <div className="mt-4 overflow-hidden rounded-xl">
                  <div className="relative aspect-video bg-gray-900">
                    <iframe
                      src={`https://www.youtube.com/embed/${youtubeId}?rel=0`}
                      title={matchingVideo.title || "Video"}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="h-full w-full"
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <Link
                    href={`/videos/${matchingVideo.slug || matchingVideo.id}`}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    View video details &rarr;
                  </Link>
                </div>
              </div>
            )}

            {/* No matching video — show a helpful message */}
            {!matchingVideo && (
              <div className="mt-10 rounded-xl border border-border bg-surface p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-light">
                    <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m9 9 10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 0 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 9 15.553Z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">Learn this arrangement</h3>
                    <p className="mt-1 text-sm text-muted">
                      Use the tab link above to access the full tablature. Check out{" "}
                      <Link href={`/guitarists/${g?.slug}`} className="text-primary hover:underline">
                        {g?.display_name}&apos;s profile
                      </Link>{" "}
                      for more of their fingerstyle covers and arrangements.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Artist card */}
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
            </div>

            {/* More tabs from artist */}
            {moreTabs && moreTabs.length > 0 && (
              <div className="rounded-xl border border-border p-6">
                <h2 className="font-bold text-foreground">
                  More Tabs from {g?.display_name}
                </h2>
                <div className="mt-4 space-y-3">
                  {moreTabs.map((t) => (
                    <Link
                      key={t.id}
                      href={`/tabs/${t.slug || t.id}`}
                      className="block rounded-lg p-2 transition-colors hover:bg-surface"
                    >
                      <p className="text-sm font-medium text-foreground">{t.title}</p>
                      {t.song_name && (
                        <p className="text-xs text-muted">{t.song_name}</p>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </>
  );
}
