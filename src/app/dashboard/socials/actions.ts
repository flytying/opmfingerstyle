"use server";

import { createClient } from "@/lib/supabase/server";
import type { SocialPlatform } from "@/lib/supabase/types";

export async function addSocial(guitaristId: string, formData: FormData) {
  const supabase = await createClient();
  const platform = formData.get("platform") as SocialPlatform;
  const external_url = formData.get("external_url") as string;

  if (!platform || !external_url) return { success: false, error: "Platform and URL are required." };

  const { error } = await supabase.from("social_links").insert({
    guitarist_id: guitaristId,
    platform,
    external_url,
  });

  if (error) {
    console.error("Add social failed:", error);
    return { success: false, error: "Failed to add social link." };
  }

  return { success: true };
}

export async function removeSocial(socialId: string) {
  const supabase = await createClient();
  await supabase.from("social_links").delete().eq("id", socialId);
  return { success: true };
}
