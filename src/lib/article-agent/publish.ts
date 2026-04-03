import { createClient } from "@supabase/supabase-js";
import type { GeneratedArticle } from "./generate";

export async function publishArticle(
  article: GeneratedArticle,
  featuredImageUrl: string | null
) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Check for slug collision
  const { data: existing } = await supabase
    .from("articles")
    .select("id")
    .eq("slug", article.slug)
    .limit(1);

  const slug =
    existing && existing.length > 0
      ? `${article.slug}-${Date.now().toString(36)}`
      : article.slug;

  const { data, error } = await supabase
    .from("articles")
    .insert({
      slug,
      title: article.title,
      excerpt: article.excerpt,
      body: article.body,
      featured_image_url: featuredImageUrl,
      status: "published",
      published_at: new Date().toISOString(),
    })
    .select("id, slug")
    .single();

  if (error) {
    throw new Error(`Failed to publish article: ${error.message}`);
  }

  return data;
}

export async function getRecentArticleTitles(): Promise<string[]> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data } = await supabase
    .from("articles")
    .select("title")
    .order("created_at", { ascending: false })
    .limit(20);

  return (data || []).map((a: { title: string }) => a.title);
}
