"use server";

import { createClient, createServiceClient } from "@/lib/supabase/server";

export async function removeVideoWithStrike(reportId: string, videoId: string, guitaristId: string) {
  const supabase = await createClient();
  const serviceClient = await createServiceClient();

  // 1. Remove the video
  await supabase.from("guitarist_videos").delete().eq("id", videoId);

  // 2. Mark report as actioned
  await supabase.from("video_reports").update({ status: "actioned" }).eq("id", reportId);

  // 3. Increment strikes
  const { data: guitarist } = await serviceClient
    .from("guitarists")
    .select("strikes")
    .eq("id", guitaristId)
    .single();

  const newStrikes = (guitarist?.strikes || 0) + 1;

  await serviceClient
    .from("guitarists")
    .update({ strikes: newStrikes })
    .eq("id", guitaristId);

  // 4. Auto-disable at 3 strikes
  if (newStrikes >= 3) {
    await serviceClient
      .from("guitarists")
      .update({ approval_status: "rejected" })
      .eq("id", guitaristId);
  }

  return { success: true, strikes: newStrikes };
}

export async function dismissReport(reportId: string) {
  const supabase = await createClient();
  await supabase.from("video_reports").update({ status: "reviewed" }).eq("id", reportId);
  return { success: true };
}
