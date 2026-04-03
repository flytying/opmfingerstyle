import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { VideosManager } from "./manager";

export default async function DashboardVideosPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: guitarist } = await supabase
    .from("guitarists")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!guitarist) redirect("/");

  const { data: videos } = await supabase
    .from("guitarist_videos")
    .select("*")
    .eq("guitarist_id", guitarist.id)
    .order("featured_order")
    .order("created_at", { ascending: false });

  return <VideosManager guitaristId={guitarist.id} videos={videos || []} />;
}
