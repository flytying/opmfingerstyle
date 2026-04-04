"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { updateVideo } from "../../actions";
import type { GuitaristVideo } from "@/lib/supabase/types";

export function EditVideoForm({ video }: { video: GuitaristVideo }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSave(formData: FormData) {
    setSaving(true);
    setMessage("");
    const result = await updateVideo(video.id, formData);
    setSaving(false);
    if (result.success) {
      router.push("/dashboard/videos");
      router.refresh();
    } else {
      setMessage(result.error || "Failed to update.");
    }
  }

  return (
    <form action={handleSave} className="mt-6 space-y-4">
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
            defaultValue={video.youtube_url}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground">Title *</label>
          <input
            name="title"
            required
            defaultValue={video.title || ""}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground">Description</label>
        <textarea
          name="description"
          rows={4}
          defaultValue={video.description || ""}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
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
