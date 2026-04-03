"use server";

import { createClient } from "@/lib/supabase/server";

export async function addVideo(guitaristId: string, formData: FormData) {
  const supabase = await createClient();
  const youtube_url = formData.get("youtube_url") as string;
  const title = (formData.get("title") as string) || null;

  if (!youtube_url) return { success: false, error: "YouTube URL is required." };

  const { error } = await supabase.from("guitarist_videos").insert({
    guitarist_id: guitaristId,
    youtube_url,
    title,
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
