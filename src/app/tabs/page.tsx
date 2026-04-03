import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Tabs & Arrangements",
  description:
    "Find fingerstyle guitar tabs and arrangements for OPM songs by Filipino artists.",
};

export default async function TabsPage() {
  const supabase = await createClient();

  const { data: tabs } = await supabase
    .from("tablature_links")
    .select(`
      id,
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

  const approvedTabs = tabs?.filter(
    (t) => (t.guitarists as { approval_status: string } | null)?.approval_status === "approved"
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Tabs & Arrangements
        </h1>
        <p className="mt-2 text-lg text-muted">
          Find fingerstyle guitar tabs and arrangements for OPM songs.
        </p>
      </div>

      {approvedTabs && approvedTabs.length > 0 ? (
        <div className="space-y-3">
          {approvedTabs.map((tab) => {
            const g = tab.guitarists as { slug: string; display_name: string } | null;
            return (
            <a
              key={tab.id}
              href={tab.external_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:border-primary hover:bg-primary-light"
            >
              <div>
                <p className="font-medium text-foreground">{tab.title}</p>
                <div className="mt-1 flex items-center gap-2 text-sm text-muted">
                  {tab.song_name && <span>{tab.song_name}</span>}
                  {tab.song_name && g?.display_name && (
                    <span>&middot;</span>
                  )}
                  {g?.display_name && (
                    <Link
                      href={`/guitarists/${g.slug}`}
                      className="hover:text-primary"
                    >
                      {g.display_name}
                    </Link>
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
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </div>
            </a>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-surface px-6 py-16 text-center">
          <p className="text-lg text-muted">No tabs available yet.</p>
        </div>
      )}
    </div>
  );
}
