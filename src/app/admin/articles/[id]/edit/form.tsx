"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveArticle } from "./actions";
import type { Article } from "@/lib/supabase/types";

interface Props {
  article: Article | null;
  isNew: boolean;
}

export function ArticleEditorForm({ article, isNew }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSave(formData: FormData) {
    setSaving(true);
    setMessage("");
    const result = await saveArticle(article?.id || null, formData);
    setSaving(false);
    if (result.success) {
      setMessage("Saved successfully.");
      if (isNew && result.id) {
        router.push(`/admin/articles/${result.id}/edit`);
      }
      router.refresh();
    } else {
      setMessage(result.error || "Failed to save.");
    }
  }

  return (
    <form action={handleSave} className="mt-6 space-y-4">
      {message && (
        <div className={`rounded-lg border p-3 text-sm ${message.includes("success") || message.includes("Saved") ? "border-green-200 bg-green-50 text-green-700" : "border-red-200 bg-red-50 text-red-700"}`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-foreground">Title</label>
          <input
            name="title"
            required
            defaultValue={article?.title || ""}
            className="mt-1 block w-full rounded-lg border border-border px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground">Slug</label>
          <input
            name="slug"
            required
            defaultValue={article?.slug || ""}
            placeholder="my-article-slug"
            className="mt-1 block w-full rounded-lg border border-border px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground">Excerpt</label>
        <textarea
          name="excerpt"
          rows={2}
          defaultValue={article?.excerpt || ""}
          className="mt-1 block w-full rounded-lg border border-border px-3 py-2 text-sm"
          placeholder="Brief summary for listings and SEO"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground">Featured Image URL</label>
        <input
          name="featured_image_url"
          defaultValue={article?.featured_image_url || ""}
          className="mt-1 block w-full rounded-lg border border-border px-3 py-2 text-sm"
          placeholder="https://..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground">Body (HTML)</label>
        <textarea
          name="body"
          required
          rows={16}
          defaultValue={article?.body || ""}
          className="mt-1 block w-full rounded-lg border border-border px-3 py-2 font-mono text-sm"
          placeholder="Write your article content in HTML..."
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-foreground">Status</label>
          <select
            name="status"
            defaultValue={article?.status || "draft"}
            className="mt-1 block w-full rounded-lg border border-border px-3 py-2 text-sm"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="rounded-full bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-50"
      >
        {saving ? "Saving..." : isNew ? "Create Article" : "Save Changes"}
      </button>
    </form>
  );
}
