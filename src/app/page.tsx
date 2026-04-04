import Link from "next/link";
import Image from "next/image";
import { websiteJsonLd } from "@/lib/structured-data";

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }}
      />
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gray-900">
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <div className="flex flex-col items-center gap-10 lg:flex-row lg:gap-16">
            <div className="max-w-2xl flex-1">
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
            <div className="hidden shrink-0 lg:block">
              <Image
                src="/hero.png"
                alt="OPM Fingerstyle — Carabao playing guitar"
                width={400}
                height={400}
                priority
                className="h-80 w-80 rounded-2xl object-contain xl:h-96 xl:w-96"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Guitarists */}
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
          {/* Placeholder cards — will be replaced with dynamic data */}
          {[1, 2, 3, 4].map((i) => (
            <GuitaristCardPlaceholder key={i} />
          ))}
        </div>
      </section>

      {/* Latest Videos */}
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
            {[1, 2, 3].map((i) => (
              <VideoCardPlaceholder key={i} />
            ))}
          </div>
        </div>
      </section>

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
          {[1, 2, 3].map((i) => (
            <ArticleCardPlaceholder key={i} />
          ))}
        </div>
      </section>
    </>
  );
}

function GuitaristCardPlaceholder() {
  return (
    <div className="group overflow-hidden rounded-xl border border-border bg-background transition-shadow hover:shadow-lg">
      <div className="aspect-square bg-gray-200" />
      <div className="p-4">
        <div className="h-5 w-32 rounded bg-gray-200" />
        <div className="mt-2 h-4 w-24 rounded bg-gray-100" />
        <div className="mt-3 h-3 w-full rounded bg-gray-100" />
      </div>
    </div>
  );
}

function VideoCardPlaceholder() {
  return (
    <div className="group overflow-hidden rounded-xl border border-border bg-background transition-shadow hover:shadow-lg">
      <div className="aspect-video bg-gray-200" />
      <div className="p-4">
        <div className="h-4 w-48 rounded bg-gray-200" />
        <div className="mt-2 h-3 w-32 rounded bg-gray-100" />
      </div>
    </div>
  );
}

function ArticleCardPlaceholder() {
  return (
    <div className="group overflow-hidden rounded-xl border border-border bg-background transition-shadow hover:shadow-lg">
      <div className="aspect-[16/9] bg-gray-200" />
      <div className="p-4">
        <div className="h-3 w-16 rounded bg-amber-100" />
        <div className="mt-2 h-5 w-full rounded bg-gray-200" />
        <div className="mt-2 h-3 w-full rounded bg-gray-100" />
        <div className="mt-1 h-3 w-3/4 rounded bg-gray-100" />
      </div>
    </div>
  );
}
