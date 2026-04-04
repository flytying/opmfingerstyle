"use server";

import { createClient } from "@/lib/supabase/server";
import { notifyNewContactMessage } from "@/lib/email";

export async function reportVideo(formData: FormData) {
  const videoId = formData.get("video_id") as string;
  const reason = formData.get("reason") as string;

  if (!videoId || !reason) return { success: false };

  const supabase = await createClient();

  await supabase.from("video_reports").insert({
    video_id: videoId,
    reason,
  });

  // Notify admin
  notifyNewContactMessage("Video Report", `Video reported: ${reason}`);

  return { success: true };
}
