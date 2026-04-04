import Link from "next/link";
import Image from "next/image";
import { websiteJsonLd } from "@/lib/structured-data";
import { createClient } from "@/lib/supabase/server";
import { GuitaristCard } from "@/components/ui/guitarist-card";
import { VideoCard } from "@/components/ui/video-card";
import { ArticleCard } from "@/components/ui/article-card";

export default async function Home() {
  const supabase = await createClient();

  // Fetch data in parallel
  const [{ data: guitarists }, { data: videos }, { data: articles }] = await Promise.all([
    supabase
      .from("guitarists")
      .select("slug, display_name, location, bio_short, profile_photo_url")
      .eq("approval_status", "approved")
      .order("featured", { ascending: false })
      .limit(4),
    supabase
      .from("guitarist_videos")
      .select("id, slug, youtube_url, title, thumbnail_url, guitarists!inner(slug, display_name, approval_status)")
      .order("created_at", { ascending: false })
      .limit(6),
    supabase
      .from("articles")
      .select("slug, title, excerpt, featured_image_url, published_at")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(3),
  ]);

  const approvedVideos = videos?.filter(
    (v) => (v.guitarists as { approval_status: string } | null)?.approval_status === "approved"
  ).slice(0, 3);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }}
      />
      {/* Hero Section */}
      <section className="relative min-h-[400px] overflow-hidden bg-gray-900">
        <div className="absolute inset-0">
          <Image
            src="/hero-background.png"
            alt=""
            fill
            priority
            className="object-cover opacity-40"
            sizes="100vw"
            quality={75}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-gray-900/40" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-wider text-amber-300">
              The Home of Filipino Fingerstyle
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Discover OPM
              <br />
              Fingerstyle Guitarists
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Explore talented Filipino fingerstyle guitarists performing
              Original Pilipino Music. Watch performances, find tabs, and
              connect with the community.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/guitarists"
                className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
              >
                Browse Guitarists
              </Link>
              <Link
                href="/submit"
                className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
              >
                Submit Your Profile
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Guitarists */}
      {guitarists && guitarists.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground">
                Featured Guitarists
              </h2>
              <p className="mt-2 text-muted">
                Meet the talented artists behind the music.
              </p>
            </div>
            <Link
              href="/guitarists"
              className="hidden text-sm font-medium text-primary hover:text-primary-hover sm:block"
            >
              View all &rarr;
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {guitarists.map((guitarist) => (
              <GuitaristCard key={guitarist.slug} guitarist={guitarist} />
            ))}
          </div>
        </section>
      )}

      {/* Latest Videos */}
      {approvedVideos && approvedVideos.length > 0 && (
        <section className="bg-surface">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-foreground">
                  Latest Videos
                </h2>
                <p className="mt-2 text-muted">
                  Watch the latest OPM fingerstyle performances.
                </p>
              </div>
              <Link
                href="/videos"
                className="hidden text-sm font-medium text-primary hover:text-primary-hover sm:block"
              >
                View all &rarr;
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white">
              Are you a fingerstyle guitarist?
            </h2>
            <p className="mt-4 text-lg text-gray-300">
              Join our directory and share your OPM fingerstyle arrangements
              with a growing community of music lovers.
            </p>
            <Link
              href="/submit"
              className="mt-8 inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
            >
              Submit Your Profile
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Articles */}
      {articles && articles.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground">
                From the Blog
              </h2>
              <p className="mt-2 text-muted">
                Guides, gear reviews, and stories from the community.
              </p>
            </div>
            <Link
              href="/blog"
              className="hidden text-sm font-medium text-primary hover:text-primary-hover sm:block"
            >
              View all &rarr;
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
