"use server";

import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

export async function addVideo(guitaristId: string, formData: FormData) {
  const supabase = await createClient();
  const youtube_url = formData.get("youtube_url") as string;
  const title = (formData.get("title") as string) || null;
  const description = (formData.get("description") as string) || null;

  if (!youtube_url || !title) return { success: false, error: "YouTube URL and title are required." };

  const slug = `${slugify(title)}-${Date.now().toString(36)}`;

  const { error } = await supabase.from("guitarist_videos").insert({
    guitarist_id: guitaristId,
    youtube_url,
    title,
    slug,
    description,
  });

  if (error) {
    console.error("Add video failed:", error);
    return { success: false, error: "Failed to add video." };
  }

  return { success: true };
}

export async function removeVideo(videoId: string) {
  const supabase = await createClient();
  await supabase.from("guitarist_videos").delete().eq("id", videoId);
  return { success: true };
}
