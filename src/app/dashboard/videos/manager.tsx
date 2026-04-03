"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addVideo, removeVideo } from "./actions";
import type { GuitaristVideo } from "@/lib/supabase/types";

export function VideosManager({ guitaristId, videos }: { guitaristId: string; videos: GuitaristVideo[] }) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
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
          <div className={`mt-3 rounded-lg border p-2 text-sm ${message.includes("added") ? "border-green-200 bg-green-50 text-green-700" : "border-red-200 bg-red-50 text-red-700"}`}>
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
            <label className="block text-sm font-medium text-foreground">Title</label>
            <input
              name="title"
              placeholder="Song title or description"
              className="mt-1 block w-full rounded-lg border border-border px-3 py-2 text-sm"
            />
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
      <div className="space-y-2">
        <h2 className="font-semibold text-foreground">Your Videos ({videos.length})</h2>
        {videos.length > 0 ? (
          videos.map((v) => (
            <div key={v.id} className="flex items-center justify-between rounded-lg border border-border p-4">
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-foreground">{v.title || "Untitled"}</p>
                <a href={v.youtube_url} target="_blank" rel="noopener noreferrer" className="truncate text-sm text-muted hover:text-primary">
                  {v.youtube_url}
                </a>
              </div>
              <button
                onClick={() => handleRemove(v.id)}
                className="ml-4 shrink-0 text-sm text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>
          ))
        ) : (
          <p className="py-8 text-center text-muted">No videos yet. Add your first one above.</p>
        )}
      </div>
    </div>
  );
}
