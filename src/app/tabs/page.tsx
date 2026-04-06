import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { TabSearchFilter } from "./search-filter";

export const metadata: Metadata = {
  title: "OPM Fingerstyle Tabs",
  description:
    "Find fingerstyle guitar tabs and arrangements for OPM songs by Filipino artists.",
};

interface Props {
  searchParams: Promise<{ q?: string; artist?: string }>;
}

export default async function TabsPage({ searchParams }: Props) {
  const { q, artist } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("tablature_links")
    .select(`
      id,
      slug,
      title,
      song_name,
      source_label,
      external_url,
      created_at,
      guitarists!inner (
        slug,
        display_name,
        approval_status
      )
    `)
    .order("created_at", { ascending: false });

  if (q) {
    query = query.or(`title.ilike.%${q}%,song_name.ilike.%${q}%`);
  }

  const { data: tabs } = await query;

  let approvedTabs = tabs?.filter(
    (t) => (t.guitarists as { approval_status: string } | null)?.approval_status === "approved"
  );

  if (artist && approvedTabs) {
    approvedTabs = approvedTabs.filter(
      (t) => (t.guitarists as { slug: string } | null)?.slug === artist
    );
  }

  // Get unique artists for dropdown
  const artistMap = new Map<string, string>();
  tabs?.forEach((t) => {
    const g = t.guitarists as { slug: string; display_name: string; approval_status: string } | null;
    if (g?.approval_status === "approved") {
      artistMap.set(g.slug, g.display_name);
    }
  });
  const artists = Array.from(artistMap.entries())
    .map(([slug, display_name]) => ({ slug, display_name }))
    .sort((a, b) => a.display_name.localeCompare(b.display_name));

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          OPM Fingerstyle Tabs
        </h1>
        <p className="mt-2 text-lg text-muted">
          Find fingerstyle guitar tabs and arrangements for OPM songs.
        </p>
      </div>

      <Suspense>
        <TabSearchFilter artists={artists} />
      </Suspense>

      {approvedTabs && approvedTabs.length > 0 ? (
        <div className="space-y-3">
          {approvedTabs.map((tab) => {
            const g = tab.guitarists as { slug: string; display_name: string } | null;
            const tabHref = `/tabs/${tab.slug || tab.id}`;
            return (
              <Link
                key={tab.id}
                href={tabHref}
                className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:border-primary hover:bg-primary-light"
              >
                <div>
                  <p className="font-medium text-foreground">{tab.title}</p>
                  <div className="mt-1 flex items-center gap-2 text-sm text-muted">
                    {tab.song_name && <span>{tab.song_name}</span>}
                    {tab.song_name && g?.display_name && <span>&middot;</span>}
                    {g?.display_name && (
                      <span>{g.display_name}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted">
                  {tab.source_label && (
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs">
                      {tab.source_label}
                    </span>
                  )}
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-surface px-6 py-16 text-center">
          <p className="text-lg text-muted">
            {q || artist ? "No tabs found matching your search." : "No tabs available yet."}
          </p>
        </div>
      )}
    </div>
  );
}
