import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { VideoCard } from "@/components/ui/video-card";
import { guitaristJsonLd } from "@/lib/structured-data";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: guitarist } = await supabase
    .from("guitarists")
    .select("display_name, bio_short, profile_photo_url")
    .eq("slug", slug)
    .eq("approval_status", "approved")
    .single();

  if (!guitarist) return { title: "Guitarist Not Found" };

  return {
    title: guitarist.display_name,
    description: guitarist.bio_short,
    openGraph: {
      title: `${guitarist.display_name} | OPM Fingerstyle`,
      description: guitarist.bio_short,
      images: guitarist.profile_photo_url ? [guitarist.profile_photo_url] : [],
    },
  };
}

const platformIcons: Record<string, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  youtube: "YouTube",
  tiktok: "TikTok",
  spotify: "Spotify",
  website: "Website",
  x: "X",
  other: "Link",
};

export default async function GuitaristProfilePage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: guitarist } = await supabase
    .from("guitarists")
    .select("*")
    .eq("slug", slug)
    .eq("approval_status", "approved")
    .single();

  if (!guitarist) notFound();

  const [{ data: videos }, { data: tabs }, { data: socials }] = await Promise.all([
    supabase
      .from("guitarist_videos")
      .select("*")
      .eq("guitarist_id", guitarist.id)
      .order("featured_order")
      .order("created_at", { ascending: false }),
    supabase
      .from("tablature_links")
      .select("*")
      .eq("guitarist_id", guitarist.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("social_links")
      .select("*")
      .eq("guitarist_id", guitarist.id),
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(guitaristJsonLd(guitarist, socials || [])) }}
      />
      {/* Hero */}
      <section className="relative h-80 overflow-hidden bg-gray-900 sm:h-96 lg:h-[28rem]">
        {guitarist.profile_photo_url && (
          <Image
            src={guitarist.profile_photo_url}
            alt={guitarist.display_name}
            fill
            className="object-cover opacity-40"
            priority
            sizes="100vw"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/50 to-gray-900/30" />
        <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-8 sm:px-6 lg:px-8">
          <p className="text-sm font-medium uppercase tracking-wider text-amber-300">
            Fingerstyle Guitarist
          </p>
          <h1 className="mt-2 text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
            {guitarist.display_name}
          </h1>
          {guitarist.location && (
            <p className="mt-2 text-lg text-gray-300">{guitarist.location}</p>
          )}
          {socials && socials.length > 0 && (
            <div className="mt-4 flex gap-3">
              {socials.map((social) => (
                <a
                  key={social.id}
                  href={social.external_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-white/10 px-3 py-1.5 text-sm text-white backdrop-blur transition-colors hover:bg-white/20"
                >
                  {platformIcons[social.platform] || social.platform}
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Bio */}
            <section>
              <h2 className="text-2xl font-bold text-foreground">About</h2>
              <p className="mt-4 text-muted leading-relaxed">
                {guitarist.bio_full || guitarist.bio_short}
              </p>
            </section>

            {/* Videos */}
            {videos && videos.length > 0 && (
              <section className="mt-12">
                <h2 className="text-2xl font-bold text-foreground">Videos</h2>
                <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {videos.map((video) => (
                    <VideoCard key={video.id} video={video} />
                  ))}
                </div>
              </section>
            )}

            {/* Tabs */}
            {tabs && tabs.length > 0 && (
              <section className="mt-12">
                <h2 className="text-2xl font-bold text-foreground">
                  Tabs & Arrangements
                </h2>
                <div className="mt-6 space-y-3">
                  {tabs.map((tab) => (
                    <a
                      key={tab.id}
                      href={tab.external_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:border-primary hover:bg-primary-light"
                    >
                      <div>
                        <p className="font-medium text-foreground">
                          {tab.title}
                        </p>
                        {tab.song_name && (
                          <p className="mt-0.5 text-sm text-muted">
                            {tab.song_name}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted">
                        {tab.source_label && (
                          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs">
                            {tab.source_label}
                          </span>
                        )}
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                        </svg>
                      </div>
                    </a>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            {/* Profile photo */}
            {guitarist.profile_photo_url && (
              <div className="overflow-hidden rounded-xl">
                <Image
                  src={guitarist.profile_photo_url}
                  alt={guitarist.display_name}
                  width={400}
                  height={400}
                  className="h-auto w-full object-cover"
                />
              </div>
            )}

            {/* Connect */}
            <div className="rounded-xl border border-border p-6">
              <h3 className="font-bold text-foreground">Connect</h3>

              {guitarist.location && (
                <p className="mt-3 text-sm text-muted">
                  <span className="mr-1.5">📍</span> {guitarist.location}
                </p>
              )}

              {guitarist.youtube_channel_url && (
                <a
                  href={guitarist.youtube_channel_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <path d="M8 5v14l11-7z" fill="currentColor" />
                  </svg>
                  YouTube Channel
                </a>
              )}

              {/* Social Links */}
              {socials && socials.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {socials.map((social) => (
                    <a
                      key={social.id}
                      href={social.external_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full bg-surface px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:bg-gray-200 hover:text-foreground"
                    >
                      {platformIcons[social.platform]}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
