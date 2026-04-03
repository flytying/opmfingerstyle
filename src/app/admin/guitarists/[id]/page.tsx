import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { GuitaristReviewForm } from "./form";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminGuitaristReviewPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: guitarist } = await supabase
    .from("guitarists")
    .select("*")
    .eq("id", id)
    .single();

  if (!guitarist) notFound();

  const [{ data: videos }, { data: tabs }, { data: socials }] = await Promise.all([
    supabase.from("guitarist_videos").select("*").eq("guitarist_id", id),
    supabase.from("tablature_links").select("*").eq("guitarist_id", id),
    supabase.from("social_links").select("*").eq("guitarist_id", id),
  ]);

  return (
    <div>
      <Link
        href="/admin/guitarists"
        className="text-sm text-muted hover:text-foreground"
      >
        &larr; Back to Guitarists
      </Link>

      <div className="mt-4 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {guitarist.display_name}
          </h1>
          <p className="mt-1 text-muted">
            Submitted {new Date(guitarist.created_at).toLocaleDateString()}
            {guitarist.contact_email && ` · ${guitarist.contact_email}`}
          </p>
        </div>
      </div>

      <GuitaristReviewForm
        guitarist={guitarist}
        videos={videos || []}
        tabs={tabs || []}
        socials={socials || []}
      />
    </div>
  );
}
