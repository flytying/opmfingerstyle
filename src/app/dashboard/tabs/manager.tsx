"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addTab, removeTab, updateTab } from "./actions";
import type { TablatureLink } from "@/lib/supabase/types";

export function TabsManager({ guitaristId, tabs }: { guitaristId: string; tabs: TablatureLink[] }) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function handleAdd(formData: FormData) {
    setAdding(true);
    setMessage("");
    const result = await addTab(guitaristId, formData);
    setAdding(false);
    if (result.success) {
      setMessage("Tab added!");
      router.refresh();
    } else {
      setMessage(result.error || "Failed to add tab.");
    }
  }

  async function handleUpdate(tabId: string, formData: FormData) {
    setSaving(true);
    setMessage("");
    const result = await updateTab(tabId, formData);
    setSaving(false);
    if (result.success) {
      setMessage("Tab updated!");
      setEditingId(null);
      router.refresh();
    } else {
      setMessage(result.error || "Failed to update.");
    }
  }

  async function handleRemove(tabId: string) {
    if (!confirm("Remove this tab link?")) return;
    await removeTab(tabId);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <form action={handleAdd} className="rounded-xl border border-border bg-background p-6">
        <h2 className="font-semibold text-foreground">Add Tab Link</h2>
        {message && (
          <div className={`mt-3 rounded-lg border p-2 text-sm ${message.includes("added") || message.includes("updated") ? "border-green-200 bg-green-50 text-green-700" : "border-red-200 bg-red-50 text-red-700"}`}>
            {message}
          </div>
        )}
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-foreground">Title *</label>
            <input name="title" required placeholder="e.g. Narda - Kamikazee" className="mt-1 block w-full rounded-lg border border-border px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground">Song Name</label>
            <input name="song_name" placeholder="Original song name" className="mt-1 block w-full rounded-lg border border-border px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground">Link URL *</label>
            <input name="external_url" required placeholder="https://..." className="mt-1 block w-full rounded-lg border border-border px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground">Source</label>
            <input name="source_label" placeholder="e.g. Ultimate Guitar, PDF" className="mt-1 block w-full rounded-lg border border-border px-3 py-2 text-sm" />
          </div>
        </div>
        <button type="submit" disabled={adding} className="mt-4 rounded-full bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-50">
          {adding ? "Adding..." : "Add Tab"}
        </button>
      </form>

      <div className="space-y-3">
        <h2 className="font-semibold text-foreground">Your Tabs ({tabs.length})</h2>
        {tabs.length > 0 ? (
          tabs.map((t) => (
            <div key={t.id} className="rounded-lg border border-border p-4">
              {editingId === t.id ? (
                <form action={(formData) => handleUpdate(t.id, formData)} className="space-y-3">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-medium text-muted">Title</label>
                      <input name="title" defaultValue={t.title} className="mt-1 block w-full rounded-lg border border-border px-3 py-2 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted">Song Name</label>
                      <input name="song_name" defaultValue={t.song_name || ""} className="mt-1 block w-full rounded-lg border border-border px-3 py-2 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted">Link URL</label>
                      <input name="external_url" defaultValue={t.external_url} className="mt-1 block w-full rounded-lg border border-border px-3 py-2 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted">Source</label>
                      <input name="source_label" defaultValue={t.source_label || ""} className="mt-1 block w-full rounded-lg border border-border px-3 py-2 text-sm" />
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
                    <p className="font-medium text-foreground">{t.title}</p>
                    <p className="text-sm text-muted">
                      {t.song_name || "—"} {t.source_label && `· ${t.source_label}`}
                    </p>
                  </div>
                  <div className="ml-4 flex shrink-0 gap-4">
                    <button onClick={() => setEditingId(t.id)} className="text-sm font-medium text-foreground hover:text-muted">
                      Edit
                    </button>
                    <button onClick={() => handleRemove(t.id)} className="text-sm text-red-600 hover:text-red-800">
                      Remove
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="py-8 text-center text-muted">No tabs yet. Add your first one above.</p>
        )}
      </div>
    </div>
  );
}
