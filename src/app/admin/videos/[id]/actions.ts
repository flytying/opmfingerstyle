"use server";

import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

export async function saveVideo(id: string | null, formData: FormData) {
  const supabase = await createClient();

  const title = formData.get("title") as string;
  const youtube_url = formData.get("youtube_url") as string;
  const guitarist_id = formData.get("guitarist_id") as string;
  const description = (formData.get("description") as string) || null;
  const featured_order = parseInt(formData.get("featured_order") as string) || 0;

  const slug = `${slugify(title)}-${Date.now().toString(36)}`;

  if (id) {
    // Update — regenerate slug from new title
    const { error } = await supabase
      .from("guitarist_videos")
      .update({
        title,
        youtube_url,
        guitarist_id,
        description,
        featured_order,
        slug: `${slugify(title)}-${id.substring(0, 8)}`,
      })
      .eq("id", id);

    if (error) {
      console.error("Update video failed:", error);
      return { success: false, error: "Failed to update video." };
    }

    return { success: true, id };
  } else {
    // Create
    const { data, error } = await supabase
      .from("guitarist_videos")
      .insert({
        title,
        youtube_url,
        guitarist_id,
        description,
        featured_order,
        slug,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Create video failed:", error);
      return { success: false, error: "Failed to add video." };
    }

    return { success: true, id: data?.id };
  }
}

export async function deleteVideo(id: string) {
  const supabase = await createClient();
  await supabase.from("guitarist_videos").delete().eq("id", id);
  return { success: true };
}
