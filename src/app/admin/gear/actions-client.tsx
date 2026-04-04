"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toggleGearActive, createGearProduct } from "./actions";

export function GearActions({ productId, active }: { productId: string; active: boolean }) {
  const router = useRouter();

  async function handleToggle() {
    await toggleGearActive(productId, !active);
    router.refresh();
  }

  return (
    <button
      onClick={handleToggle}
      className="text-sm font-medium text-primary hover:text-primary-hover"
    >
      {active ? "Deactivate" : "Activate"}
    </button>
  );
}

const categories = [
  { value: "acoustic_guitar", label: "Acoustic Guitar" },
  { value: "classical_guitar", label: "Classical Guitar" },
  { value: "strings", label: "Strings" },
  { value: "capo", label: "Capo" },
  { value: "tuner", label: "Tuner" },
  { value: "pickup", label: "Pickup" },
  { value: "microphone", label: "Microphone" },
  { value: "audio_interface", label: "Audio Interface" },
  { value: "amp", label: "Amp" },
  { value: "cable", label: "Cable" },
  { value: "stand", label: "Stand" },
  { value: "accessory", label: "Accessory" },
];

export function NewGearForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(formData: FormData) {
    setSaving(true);
    setMessage("");
    const result = await createGearProduct(formData);
    setSaving(false);
    if (result.success) {
      setMessage("Product created!");
      setOpen(false);
      router.refresh();
    } else {
      setMessage(result.error || "Failed to create product.");
    }
  }

  return (
    <div className="mt-6">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover"
        >
          + Add Product
        </button>
      ) : (
        <form action={handleSubmit} className="rounded-xl border border-border bg-background p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">New Product</h2>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-sm text-muted hover:text-foreground"
            >
              Cancel
            </button>
          </div>

          {message && (
            <div className={`mt-3 rounded-lg border p-2 text-sm ${message.includes("created") ? "border-green-200 bg-green-50 text-green-700" : "border-red-200 bg-red-50 text-red-700"}`}>
              {message}
            </div>
          )}

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-foreground">Name *</label>
              <input name="name" required className="mt-1 block w-full rounded-lg border border-border px-3 py-2 text-sm" placeholder="e.g. Yamaha FG800" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">Brand</label>
              <input name="brand" className="mt-1 block w-full rounded-lg border border-border px-3 py-2 text-sm" placeholder="e.g. Yamaha" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">Category *</label>
              <select name="category" required className="mt-1 block w-full appearance-none rounded-lg border border-gray-300 py-2 pl-3 pr-10 text-sm" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='2' stroke='%23737373'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='m19.5 8.25-7.5 7.5-7.5-7.5'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 0.75rem center", backgroundSize: "1rem" }}>
                {categories.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">Image URL</label>
              <input name="image_url" className="mt-1 block w-full rounded-lg border border-border px-3 py-2 text-sm" placeholder="https://..." />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-foreground">Short Description</label>
              <textarea name="short_description" rows={2} className="mt-1 block w-full rounded-lg border border-border px-3 py-2 text-sm" placeholder="Brief product description" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">Product URL</label>
              <input name="external_url" className="mt-1 block w-full rounded-lg border border-border px-3 py-2 text-sm" placeholder="https://..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">Affiliate URL</label>
              <input name="affiliate_url" className="mt-1 block w-full rounded-lg border border-border px-3 py-2 text-sm" placeholder="https://amzn.to/..." />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" name="sponsored" id="sponsored" className="rounded border-border" />
              <label htmlFor="sponsored" className="text-sm font-medium text-foreground">Sponsored Product</label>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="mt-4 rounded-full bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-50"
          >
            {saving ? "Creating..." : "Create Product"}
          </button>
        </form>
      )}
    </div>
  );
}
