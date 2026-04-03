"use server";

import { createClient } from "@/lib/supabase/server";

export async function updateProfile(guitaristId: string, formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("guitarists")
    .update({
      display_name: formData.get("display_name") as string,
      location: (formData.get("location") as string) || null,
      bio_short: formData.get("bio_short") as string,
      bio_full: (formData.get("bio_full") as string) || null,
      youtube_channel_url: (formData.get("youtube_channel_url") as string) || null,
    })
    .eq("id", guitaristId);

  if (error) {
    console.error("Profile update failed:", error);
    return { success: false, error: "Failed to update profile." };
  }

  return { success: true };
}
