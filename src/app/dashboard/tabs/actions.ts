"use server";

import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

export async function addTab(guitaristId: string, formData: FormData) {
  const supabase = await createClient();
  const title = formData.get("title") as string;
  const external_url = formData.get("external_url") as string;

  if (!title || !external_url) return { success: false, error: "Title and URL are required." };

  const { data, error } = await supabase.from("tablature_links").insert({
    guitarist_id: guitaristId,
    title,
    song_name: (formData.get("song_name") as string) || null,
    source_label: (formData.get("source_label") as string) || null,
    external_url,
  }).select("id").single();

  if (error || !data) {
    console.error("Add tab failed:", error);
    return { success: false, error: "Failed to add tab." };
  }

  // Generate slug from title + first 8 chars of ID
  const slug = slugify(title) + "-" + data.id.substring(0, 8);
  await supabase.from("tablature_links").update({ slug }).eq("id", data.id);

  return { success: true };
}

export async function updateTab(tabId: string, formData: FormData) {
  const supabase = await createClient();
  const title = formData.get("title") as string;

  const slug = slugify(title) + "-" + tabId.substring(0, 8);

  const { error } = await supabase.from("tablature_links").update({
    title,
    slug,
    song_name: (formData.get("song_name") as string) || null,
    source_label: (formData.get("source_label") as string) || null,
    external_url: formData.get("external_url") as string,
  }).eq("id", tabId);

  if (error) {
    console.error("Update tab failed:", error);
    return { success: false, error: "Failed to update tab." };
  }

  return { success: true };
}

export async function removeTab(tabId: string) {
  const supabase = await createClient();
  await supabase.from("tablature_links").delete().eq("id", tabId);
  return { success: true };
}
