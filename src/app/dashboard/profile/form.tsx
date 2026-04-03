"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateProfile } from "./actions";
import type { Guitarist } from "@/lib/supabase/types";

export function ProfileEditForm({ guitarist }: { guitarist: Guitarist }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSave(formData: FormData) {
    setSaving(true);
    setMessage("");
    const result = await updateProfile(guitarist.id, formData);
    setSaving(false);
    setMessage(result.success ? "Profile updated!" : (result.error || "Failed to save."));
    if (result.success) router.refresh();
  }

  return (
    <form action={handleSave} className="space-y-4">
      {message && (
        <div className={`rounded-lg border p-3 text-sm ${message.includes("updated") ? "border-green-200 bg-green-50 text-green-700" : "border-red-200 bg-red-50 text-red-700"}`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-foreground">Display Name</label>
          <input
            name="display_name"
            defaultValue={guitarist.display_name}
            className="mt-1 block w-full rounded-lg border border-border px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground">Location</label>
          <input
            name="location"
            defaultValue={guitarist.location || ""}
            className="mt-1 block w-full rounded-lg border border-border px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground">Short Bio</label>
        <textarea
          name="bio_short"
          defaultValue={guitarist.bio_short}
          rows={2}
          maxLength={300}
          className="mt-1 block w-full rounded-lg border border-border px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground">Full Bio</label>
        <textarea
          name="bio_full"
          defaultValue={guitarist.bio_full || ""}
          rows={5}
          className="mt-1 block w-full rounded-lg border border-border px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground">YouTube Channel URL</label>
        <input
          name="youtube_channel_url"
          defaultValue={guitarist.youtube_channel_url || ""}
          className="mt-1 block w-full rounded-lg border border-border px-3 py-2 text-sm"
        />
      </div>

      <button
        type="submit"
        disabled={saving}
        className="rounded-full bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save Profile"}
      </button>
    </form>
  );
}
