"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { addVideo } from "../actions";

export function AddVideoForm({ guitaristId }: { guitaristId: string }) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState("");

  async function handleAdd(formData: FormData) {
    setAdding(true);
    setMessage("");
    const result = await addVideo(guitaristId, formData);
    setAdding(false);
    if (result.success) {
      router.push("/dashboard/videos");
      router.refresh();
    } else {
      setMessage(result.error || "Failed to add video.");
    }
  }

  return (
    <form action={handleAdd} className="mt-6 space-y-4">
      {message && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-2 text-sm text-red-700">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-foreground">YouTube URL *</label>
          <input
            name="youtube_url"
            required
            placeholder="https://youtube.com/watch?v=..."
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground">Title *</label>
          <input
            name="title"
            required
            placeholder="e.g. Narda - Kamikazee Fingerstyle Cover"
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground">Description</label>
        <textarea
          name="description"
          rows={4}
          placeholder="Describe the arrangement, technique, and song..."
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      {/* Optional tab link */}
      <div className="rounded-lg border border-dashed border-gray-300 bg-surface p-4">
        <p className="text-sm font-medium text-foreground">Guitar Tab (optional)</p>
        <p className="mt-0.5 text-xs text-muted">Add a tab link for this song — it will also appear in your Tabs section.</p>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div>
            <label className="block text-xs font-medium text-muted">Tab URL</label>
            <input name="tab_url" placeholder="https://..." className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted">Song Name</label>
            <input name="tab_song_name" placeholder="e.g. Fill Her" className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted">Source</label>
            <input name="tab_source" placeholder="e.g. Ultimate Guitar, PDF" className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={adding}
          className="rounded-full bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-50"
        >
          {adding ? "Adding..." : "Add Video"}
        </button>
        <Link
          href="/dashboard/videos"
          className="rounded-full border border-border px-6 py-2 text-sm font-medium text-muted hover:text-foreground"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
