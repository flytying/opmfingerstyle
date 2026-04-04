import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

const BASE_URL = "https://opmfingerstyle.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  const [{ data: guitarists }, { data: gear }, { data: articles }, { data: videos }] =
    await Promise.all([
      supabase
        .from("guitarists")
        .select("slug, updated_at")
        .eq("approval_status", "approved"),
      supabase
        .from("gear_products")
        .select("slug, updated_at")
        .eq("active", true),
      supabase
        .from("articles")
        .select("slug, updated_at")
        .eq("status", "published"),
      supabase
        .from("guitarist_videos")
        .select("id, created_at"),
    ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/guitarists`, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/videos`, changeFrequency: "daily", priority: 0.7 },
    { url: `${BASE_URL}/tabs`, changeFrequency: "daily", priority: 0.7 },
    { url: `${BASE_URL}/gear`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/blog`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/submit`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/about`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE_URL}/contact`, changeFrequency: "monthly", priority: 0.3 },
  ];

  const guitaristPages: MetadataRoute.Sitemap = (guitarists || []).map((g) => ({
    url: `${BASE_URL}/guitarists/${g.slug}`,
    lastModified: g.updated_at,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const gearPages: MetadataRoute.Sitemap = (gear || []).map((p) => ({
    url: `${BASE_URL}/gear/${p.slug}`,
    lastModified: p.updated_at,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const articlePages: MetadataRoute.Sitemap = (articles || []).map((a) => ({
    url: `${BASE_URL}/blog/${a.slug}`,
    lastModified: a.updated_at,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const videoPages: MetadataRoute.Sitemap = (videos || []).map((v) => ({
    url: `${BASE_URL}/videos/${v.id}`,
    lastModified: v.created_at,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...guitaristPages, ...videoPages, ...gearPages, ...articlePages];
}
