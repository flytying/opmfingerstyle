"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addVideo, removeVideo, updateVideo } from "./actions";
import type { GuitaristVideo } from "@/lib/supabase/types";

export function VideosManager({ guitaristId, videos }: { guitaristId: string; videos: GuitaristVideo[] }) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function handleAdd(formData: FormData) {
    setAdding(true);
    setMessage("");
    const result = await addVideo(guitaristId, formData);
    setAdding(false);
    if (result.success) {
      setMessage("Video added!");
      router.refresh();
    } else {
      setMessage(result.error || "Failed to add video.");
    }
  }

  async function handleUpdate(videoId: string, formData: FormData) {
    setSaving(true);
    setMessage("");
    const result = await updateVideo(videoId, formData);
    setSaving(false);
    if (result.success) {
      setMessage("Video updated!");
      setEditingId(null);
      router.refresh();
    } else {
      setMessage(result.error || "Failed to update.");
    }
  }

  async function handleRemove(videoId: string) {
    if (!confirm("Remove this video?")) return;
    await removeVideo(videoId);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      {/* Add form */}
      <form action={handleAdd} className="rounded-xl border border-border bg-background p-6">
        <h2 className="font-semibold text-foreground">Add Video</h2>
        {message && (
          <div className={`mt-3 rounded-lg border p-2 text-sm ${message.includes("added") || message.includes("updated") ? "border-green-200 bg-green-50 text-green-700" : "border-red-200 bg-red-50 text-red-700"}`}>
            {message}
          </div>
        )}
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-foreground">YouTube URL *</label>
            <input
              name="youtube_url"
              required
              placeholder="https://youtube.com/watch?v=..."
              className="mt-1 block w-full rounded-lg border border-border px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground">Title *</label>
            <input
              name="title"
              required
              placeholder="e.g. Narda - Kamikazee Fingerstyle Cover"
              className="mt-1 block w-full rounded-lg border border-border px-3 py-2 text-sm"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-foreground">Description</label>
            <textarea
              name="description"
              rows={3}
              placeholder="Describe the arrangement, technique, and song..."
              className="mt-1 block w-full rounded-lg border border-border px-3 py-2 text-sm"
            />
          </div>

          {/* Optional tab link */}
          <div className="sm:col-span-2 rounded-lg border border-dashed border-border bg-surface p-4">
            <p className="text-sm font-medium text-foreground">Guitar Tab (optional)</p>
            <p className="mt-0.5 text-xs text-muted">Add a tab link for this song — it will also appear in your Tabs section.</p>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-medium text-muted">Tab URL</label>
                <input name="tab_url" placeholder="https://..." className="mt-1 block w-full rounded-lg border border-border px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted">Song Name</label>
                <input name="tab_song_name" placeholder="e.g. Fill Her" className="mt-1 block w-full rounded-lg border border-border px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted">Source</label>
                <input name="tab_source" placeholder="e.g. Ultimate Guitar, PDF" className="mt-1 block w-full rounded-lg border border-border px-3 py-2 text-sm" />
              </div>
            </div>
          </div>
        </div>
        <button
          type="submit"
          disabled={adding}
          className="mt-4 rounded-full bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-50"
        >
          {adding ? "Adding..." : "Add Video"}
        </button>
      </form>

      {/* List */}
      <div className="space-y-3">
        <h2 className="font-semibold text-foreground">Your Videos ({videos.length})</h2>
        {videos.length > 0 ? (
          videos.map((v) => (
            <div key={v.id} className="rounded-lg border border-border p-4">
              {editingId === v.id ? (
                <form action={(formData) => handleUpdate(v.id, formData)} className="space-y-3">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-medium text-muted">Title</label>
                      <input name="title" defaultValue={v.title || ""} className="mt-1 block w-full rounded-lg border border-border px-3 py-2 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted">YouTube URL</label>
                      <input name="youtube_url" defaultValue={v.youtube_url} className="mt-1 block w-full rounded-lg border border-border px-3 py-2 text-sm" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-muted">Description</label>
                      <textarea name="description" defaultValue={v.description || ""} rows={3} className="mt-1 block w-full rounded-lg border border-border px-3 py-2 text-sm" />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" disabled={saving} className="rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-50">
                      {saving ? "Saving..." : "Save"}
                    </button>
                    <button type="button" onClick={() => setEditingId(null)} className="rounded-full border border-border px-4 py-1.5 text-sm font-medium text-muted hover:text-foreground">
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-foreground">{v.title || "Untitled"}</p>
                    <a href={v.youtube_url} target="_blank" rel="noopener noreferrer" className="truncate text-sm text-muted hover:text-primary">
                      {v.youtube_url}
                    </a>
                    {v.description && <p className="mt-1 line-clamp-1 text-sm text-muted">{v.description}</p>}
                  </div>
                  <div className="ml-4 flex shrink-0 gap-2">
                    <button onClick={() => setEditingId(v.id)} className="text-sm font-medium text-primary hover:text-primary-hover">
                      Edit
                    </button>
                    <button onClick={() => handleRemove(v.id)} className="text-sm text-red-600 hover:text-red-800">
                      Remove
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="py-8 text-center text-muted">No videos yet. Add your first one above.</p>
        )}
      </div>
    </div>
  );
}
