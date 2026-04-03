import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ArticleEditorForm } from "./form";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminArticleEditPage({ params }: Props) {
  const { id } = await params;
  const isNew = id === "new";

  let article = null;
  if (!isNew) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("articles")
      .select("*")
      .eq("id", id)
      .single();
    article = data;
  }

  return (
    <div>
      <Link
        href="/admin/articles"
        className="text-sm text-muted hover:text-foreground"
      >
        &larr; Back to Articles
      </Link>

      <h1 className="mt-4 text-2xl font-bold text-foreground">
        {isNew ? "New Article" : "Edit Article"}
      </h1>

      <ArticleEditorForm article={article} isNew={isNew} />
    </div>
  );
}
