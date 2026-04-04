import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { VideoEditForm } from "./form";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminVideoEditPage({ params }: Props) {
  const { id } = await params;
  const isNew = id === "new";
  const supabase = await createClient();

  let video = null;
  if (!isNew) {
    const { data } = await supabase
      .from("guitarist_videos")
      .select("*, guitarists(display_name)")
      .eq("id", id)
      .single();
    video = data;
  }

  // Get guitarists for dropdown
  const { data: guitarists } = await supabase
    .from("guitarists")
    .select("id, display_name")
    .eq("approval_status", "approved")
    .order("display_name");

  return (
    <div>
      <Link
        href="/admin/videos"
        className="text-sm text-muted hover:text-foreground"
      >
        &larr; Back to Videos
      </Link>

      <h1 className="mt-4 text-2xl font-bold text-foreground">
        {isNew ? "Add Video" : "Edit Video"}
      </h1>

      <VideoEditForm
        video={video}
        guitarists={guitarists || []}
        isNew={isNew}
      />
    </div>
  );
}
