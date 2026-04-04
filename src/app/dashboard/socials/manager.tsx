"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addSocial, removeSocial } from "./actions";
import type { SocialLink, SocialPlatform } from "@/lib/supabase/types";

const platforms: { value: SocialPlatform; label: string }[] = [
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "youtube", label: "YouTube" },
  { value: "tiktok", label: "TikTok" },
  { value: "spotify", label: "Spotify" },
  { value: "x", label: "X (Twitter)" },
  { value: "website", label: "Website" },
  { value: "other", label: "Other" },
];

export function SocialsManager({ guitaristId, socials }: { guitaristId: string; socials: SocialLink[] }) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState("");

  async function handleAdd(formData: FormData) {
    setAdding(true);
    setMessage("");
    const result = await addSocial(guitaristId, formData);
    setAdding(false);
    if (result.success) {
      setMessage("Link added!");
      router.refresh();
    } else {
      setMessage(result.error || "Failed to add link.");
    }
  }

  async function handleRemove(socialId: string) {
    if (!confirm("Remove this social link?")) return;
    await removeSocial(socialId);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <form action={handleAdd} className="rounded-xl border border-border bg-background p-6">
        <h2 className="font-semibold text-foreground">Add Social Link</h2>
        {message && (
          <div className={`mt-3 rounded-lg border p-2 text-sm ${message.includes("added") ? "border-green-200 bg-green-50 text-green-700" : "border-red-200 bg-red-50 text-red-700"}`}>
            {message}
          </div>
        )}
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-foreground">Platform *</label>
            <select name="platform" required className="mt-1 block w-full appearance-none rounded-lg border border-gray-300 py-2 pl-3 pr-10 text-sm" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='2' stroke='%23737373'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='m19.5 8.25-7.5 7.5-7.5-7.5'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 0.75rem center", backgroundSize: "1rem" }}>
              {platforms.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground">URL *</label>
            <input name="external_url" required placeholder="https://..." className="mt-1 block w-full rounded-lg border border-border px-3 py-2 text-sm" />
          </div>
        </div>
        <button type="submit" disabled={adding} className="mt-4 rounded-full bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-50">
          {adding ? "Adding..." : "Add Link"}
        </button>
      </form>

      <div className="space-y-2">
        <h2 className="font-semibold text-foreground">Your Social Links ({socials.length})</h2>
        {socials.length > 0 ? (
          socials.map((s) => (
            <div key={s.id} className="flex items-center justify-between rounded-lg border border-border p-4">
              <div>
                <p className="font-medium capitalize text-foreground">{s.platform}</p>
                <a href={s.external_url} target="_blank" rel="noopener noreferrer" className="text-sm text-muted hover:text-primary">
                  {s.external_url}
                </a>
              </div>
              <button onClick={() => handleRemove(s.id)} className="ml-4 shrink-0 text-sm text-red-600 hover:text-red-800">
                Remove
              </button>
            </div>
          ))
        ) : (
          <p className="py-8 text-center text-muted">No social links yet.</p>
        )}
      </div>
    </div>
  );
}
