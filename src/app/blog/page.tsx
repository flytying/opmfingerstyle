import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { ArticleCard } from "@/components/ui/article-card";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Guides, gear reviews, and stories about OPM fingerstyle guitar.",
};

export default async function BlogPage() {
  const supabase = await createClient();
  const { data: articles } = await supabase
    .from("articles")
    .select("slug, title, excerpt, featured_image_url, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Blog
        </h1>
        <p className="mt-2 text-lg text-muted">
          Guides, gear reviews, and stories from the OPM fingerstyle community.
        </p>
      </div>

      {articles && articles.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-surface px-6 py-16 text-center">
          <p className="text-lg text-muted">
            No articles published yet. Check back soon!
          </p>
        </div>
      )}
    </div>
  );
}
