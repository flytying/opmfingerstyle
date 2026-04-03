"use server";

import { createClient } from "@/lib/supabase/server";

export async function addTab(guitaristId: string, formData: FormData) {
  const supabase = await createClient();
  const title = formData.get("title") as string;
  const external_url = formData.get("external_url") as string;

  if (!title || !external_url) return { success: false, error: "Title and URL are required." };

  const { error } = await supabase.from("tablature_links").insert({
    guitarist_id: guitaristId,
    title,
    song_name: (formData.get("song_name") as string) || null,
    source_label: (formData.get("source_label") as string) || null,
    external_url,
  });

  if (error) {
    console.error("Add tab failed:", error);
    return { success: false, error: "Failed to add tab." };
  }

  return { success: true };
}

export async function removeTab(tabId: string) {
  const supabase = await createClient();
  await supabase.from("tablature_links").delete().eq("id", tabId);
  return { success: true };
}
