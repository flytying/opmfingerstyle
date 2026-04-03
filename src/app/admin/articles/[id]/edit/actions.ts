"use server";

import { createClient } from "@/lib/supabase/server";
import type { ArticleStatus } from "@/lib/supabase/types";

export async function saveArticle(id: string | null, formData: FormData) {
  const supabase = await createClient();

  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const excerpt = (formData.get("excerpt") as string) || null;
  const body = formData.get("body") as string;
  const featured_image_url = (formData.get("featured_image_url") as string) || null;
  const status = (formData.get("status") as ArticleStatus) || "draft";

  const articleData = {
    title,
    slug,
    excerpt,
    body,
    featured_image_url,
    status,
    published_at: status === "published" ? new Date().toISOString() : null,
  };

  if (id) {
    // Update
    const { error } = await supabase
      .from("articles")
      .update(articleData)
      .eq("id", id);

    if (error) {
      console.error("Update article failed:", error);
      return { success: false, error: "Failed to update article." };
    }

    return { success: true, id };
  } else {
    // Create
    const { data, error } = await supabase
      .from("articles")
      .insert({ ...articleData, slug })
      .select("id")
      .single();

    if (error) {
      console.error("Create article failed:", error);
      return { success: false, error: "Failed to create article." };
    }

    return { success: true, id: data?.id };
  }
}
