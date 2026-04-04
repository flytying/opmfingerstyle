import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { EditVideoForm } from "./form";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditVideoPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: video } = await supabase
    .from("guitarist_videos")
    .select("*")
    .eq("id", id)
    .single();

  if (!video) redirect("/dashboard/videos");

  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground">Edit Video</h2>
      <p className="mt-1 text-sm text-muted">Update your video details.</p>
      <EditVideoForm video={video} />
    </div>
  );
}
