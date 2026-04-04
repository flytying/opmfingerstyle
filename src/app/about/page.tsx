import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description: "About OPM Fingerstyle — a curated directory of Filipino fingerstyle guitarists.",
};

export default function AboutPage() {
  return (
    <>
      {/* Hero banner */}
      <section className="relative overflow-hidden bg-gray-900">
        <div className="absolute inset-0">
          <Image
            src="/hero-background.png"
            alt=""
            fill
            className="object-cover opacity-30"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 to-gray-900/40" />
        </div>
        <div className="relative mx-auto flex max-w-7xl flex-col items-center px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            About OPM Fingerstyle
          </h1>
          <p className="mt-4 max-w-xl text-lg text-gray-300">
            The home of Filipino fingerstyle guitar — celebrating OPM one
            arrangement at a time.
          </p>
          <Image
            src="/hero.png"
            alt="OPM Fingerstyle mascot — Carabao playing guitar"
            width={180}
            height={180}
            className="mt-8 rounded-2xl"
          />
        </div>
      </section>

      {/* Content */}
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-6 text-lg leading-relaxed text-muted">
          <p>
            OPM Fingerstyle is a curated directory dedicated to showcasing
            talented Filipino fingerstyle guitarists who perform Original Pilipino
            Music (OPM) songs.
          </p>
          <p>
            Our mission is to create a central hub where music lovers can discover
            guitarists, watch performances, find tablature, and explore the gear
            that makes the music possible.
          </p>
          <p>
            Whether you&apos;re a fellow guitarist looking for inspiration, a music fan
            searching for new arrangements to enjoy, or a brand looking to connect
            with the fingerstyle community — you&apos;re in the right place.
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/guitarists"
            className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
          >
            Browse Guitarists
          </Link>
          <Link
            href="/submit"
            className="inline-flex items-center justify-center rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-surface"
          >
            Submit Your Profile
          </Link>
        </div>
      </div>
    </>
  );
}
