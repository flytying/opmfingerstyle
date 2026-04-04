import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminVideosPage() {
  const supabase = await createClient();
  const { data: videos } = await supabase
    .from("guitarist_videos")
    .select("id, title, slug, youtube_url, created_at, guitarists(display_name, slug)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Videos</h1>
          <p className="mt-1 text-muted">Manage video pages — add titles, descriptions, and SEO content.</p>
        </div>
        <Link
          href="/admin/videos/new"
          className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover"
        >
          + Add Video
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-background">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-surface text-left">
              <th className="px-4 py-3 font-medium text-muted">Title</th>
              <th className="hidden px-4 py-3 font-medium text-muted sm:table-cell">Guitarist</th>
              <th className="hidden px-4 py-3 font-medium text-muted md:table-cell">Slug</th>
              <th className="px-4 py-3 font-medium text-muted">Date</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {videos && videos.length > 0 ? (
              videos.map((v) => {
                const g = v.guitarists as { display_name: string; slug: string } | null;
                return (
                  <tr key={v.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 font-medium text-foreground">
                      {v.title || <span className="text-muted italic">Untitled</span>}
                    </td>
                    <td className="hidden px-4 py-3 text-muted sm:table-cell">
                      {g?.display_name || "—"}
                    </td>
                    <td className="hidden px-4 py-3 font-mono text-xs text-muted md:table-cell">
                      {v.slug || "—"}
                    </td>
                    <td className="px-4 py-3 text-muted">
                      {new Date(v.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/videos/${v.id}`}
                        className="text-sm font-medium text-primary hover:text-primary-hover"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-muted">
                  No videos yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
