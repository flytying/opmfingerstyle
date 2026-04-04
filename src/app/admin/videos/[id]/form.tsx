"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveVideo, deleteVideo } from "./actions";
import type { GuitaristVideo } from "@/lib/supabase/types";

interface Props {
  video: (GuitaristVideo & { guitarists: { display_name: string } | null }) | null;
  guitarists: { id: string; display_name: string }[];
  isNew: boolean;
}

export function VideoEditForm({ video, guitarists, isNew }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSave(formData: FormData) {
    setSaving(true);
    setMessage("");
    const result = await saveVideo(video?.id || null, formData);
    setSaving(false);
    if (result.success) {
      setMessage("Saved successfully.");
      if (isNew && result.id) {
        router.push(`/admin/videos/${result.id}`);
      }
      router.refresh();
    } else {
      setMessage(result.error || "Failed to save.");
    }
  }

  async function handleDelete() {
    if (!video?.id) return;
    if (!confirm("Delete this video?")) return;
    setSaving(true);
    await deleteVideo(video.id);
    router.push("/admin/videos");
  }

  return (
    <form action={handleSave} className="mt-6 space-y-4">
      {message && (
        <div className={`rounded-lg border p-3 text-sm ${message.includes("Saved") ? "border-green-200 bg-green-50 text-green-700" : "border-red-200 bg-red-50 text-red-700"}`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-foreground">Title *</label>
          <input
            name="title"
            required
            defaultValue={video?.title || ""}
            placeholder="e.g. Narda - Kamikazee Fingerstyle Cover"
            className="mt-1 block w-full rounded-lg border border-border px-3 py-2 text-sm"
          />
          <p className="mt-1 text-xs text-muted">The URL slug will be generated from this title.</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground">YouTube URL *</label>
          <input
            name="youtube_url"
            required
            defaultValue={video?.youtube_url || ""}
            placeholder="https://youtube.com/watch?v=..."
            className="mt-1 block w-full rounded-lg border border-border px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground">Guitarist *</label>
        <select
          name="guitarist_id"
          required
          defaultValue={video?.guitarist_id || ""}
          className="mt-1 block w-full rounded-lg border border-border px-3 py-2 text-sm"
        >
          <option value="">Select a guitarist</option>
          {guitarists.map((g) => (
            <option key={g.id} value={g.id}>{g.display_name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground">Description</label>
        <textarea
          name="description"
          rows={6}
          defaultValue={video?.description || ""}
          placeholder="Write an SEO-friendly description of this video. Describe the arrangement, the song, technique used, etc."
          className="mt-1 block w-full rounded-lg border border-border px-3 py-2 text-sm"
        />
        <p className="mt-1 text-xs text-muted">This appears on the video detail page and in search results.</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground">Featured Order</label>
        <input
          name="featured_order"
          type="number"
          defaultValue={video?.featured_order ?? 0}
          className="mt-1 block w-32 rounded-lg border border-border px-3 py-2 text-sm"
        />
        <p className="mt-1 text-xs text-muted">Lower numbers appear first. 0 = default.</p>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-50"
        >
          {saving ? "Saving..." : isNew ? "Add Video" : "Save Changes"}
        </button>
        {!isNew && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={saving}
            className="rounded-full bg-red-600 px-6 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
          >
            Delete
          </button>
        )}
      </div>
    </form>
  );
}
