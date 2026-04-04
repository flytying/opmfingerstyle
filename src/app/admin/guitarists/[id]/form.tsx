"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { approveGuitarist, rejectGuitarist, updateGuitarist, resendInvite, disableGuitarist, enableGuitarist } from "./actions";
import type { Guitarist, GuitaristVideo, TablatureLink, SocialLink } from "@/lib/supabase/types";

interface Props {
  guitarist: Guitarist;
  videos: GuitaristVideo[];
  tabs: TablatureLink[];
  socials: SocialLink[];
}

export function GuitaristReviewForm({ guitarist, videos, tabs, socials }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSave(formData: FormData) {
    setSaving(true);
    setMessage("");
    const result = await updateGuitarist(guitarist.id, formData);
    setSaving(false);
    if (result.success) {
      setMessage("Saved successfully.");
      router.refresh();
    } else {
      setMessage(result.error || "Failed to save.");
    }
  }

  async function handleApprove() {
    if (!confirm("Approve this guitarist? This will create their account and send an invite email.")) return;
    setSaving(true);
    const result = await approveGuitarist(guitarist.id);
    setSaving(false);
    if (result.success) {
      setMessage("Guitarist approved and invite sent!");
      router.refresh();
    } else {
      setMessage(result.error || "Failed to approve.");
    }
  }

  async function handleReject() {
    if (!confirm("Reject this submission?")) return;
    setSaving(true);
    const result = await rejectGuitarist(guitarist.id);
    setSaving(false);
    if (result.success) {
      setMessage("Guitarist rejected.");
      router.refresh();
    } else {
      setMessage(result.error || "Failed to reject.");
    }
  }

  const isPending = guitarist.approval_status === "pending_review";
  const isApproved = guitarist.approval_status === "approved";

  async function handleResendInvite() {
    if (!confirm("Resend invite email to this guitarist?")) return;
    setSaving(true);
    setMessage("");
    const result = await resendInvite(guitarist.id);
    setSaving(false);
    if (result.success) {
      setMessage("Invite resent successfully!");
    } else {
      setMessage(result.error || "Failed to resend invite.");
    }
  }

  return (
    <div className="mt-6 space-y-6">
      {message && (
        <div className={`rounded-lg border p-3 text-sm ${message.includes("success") || message.includes("approved") || message.includes("Saved") || message.includes("resent") ? "border-green-200 bg-green-50 text-green-700" : "border-red-200 bg-red-50 text-red-700"}`}>
          {message}
        </div>
      )}

      {/* Action buttons */}
      {isPending && (
        <div className="flex gap-3">
          <button
            onClick={handleApprove}
            disabled={saving}
            className="rounded-full bg-green-600 px-6 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
          >
            Approve & Send Invite
          </button>
          <button
            onClick={handleReject}
            disabled={saving}
            className="rounded-full bg-red-600 px-6 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
          >
            Reject
          </button>
        </div>
      )}

      {isApproved && (
        <div className="flex gap-3">
          <button
            onClick={handleResendInvite}
            disabled={saving}
            className="rounded-full bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-50"
          >
            Resend Invite Email
          </button>
          <button
            onClick={async () => {
              if (!confirm("Disable this guitarist? Their profile will be hidden from the public site.")) return;
              setSaving(true);
              setMessage("");
              const result = await disableGuitarist(guitarist.id);
              setSaving(false);
              setMessage(result.success ? "Guitarist disabled." : (result.error || "Failed."));
              if (result.success) router.refresh();
            }}
            disabled={saving}
            className="rounded-full border border-red-300 px-6 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
          >
            Disable Account
          </button>
        </div>
      )}

      {guitarist.approval_status === "rejected" && (
        <div className="flex gap-3">
          <button
            onClick={async () => {
              if (!confirm("Re-enable this guitarist?")) return;
              setSaving(true);
              setMessage("");
              const result = await enableGuitarist(guitarist.id);
              setSaving(false);
              setMessage(result.success ? "Guitarist re-enabled." : (result.error || "Failed."));
              if (result.success) router.refresh();
            }}
            disabled={saving}
            className="rounded-full bg-green-600 px-6 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
          >
            Re-enable Account
          </button>
        </div>
      )}

      {/* Edit form */}
      <form action={handleSave} className="rounded-xl border border-border bg-background p-6">
        <h2 className="text-lg font-semibold text-foreground">Profile Details</h2>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-foreground">Display Name</label>
            <input
              name="display_name"
              defaultValue={guitarist.display_name}
              className="mt-1 block w-full rounded-lg border border-border px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground">Slug</label>
            <input
              name="slug"
              defaultValue={guitarist.slug}
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
          <div>
            <label className="block text-sm font-medium text-foreground">YouTube Channel</label>
            <input
              name="youtube_channel_url"
              defaultValue={guitarist.youtube_channel_url || ""}
              className="mt-1 block w-full rounded-lg border border-border px-3 py-2 text-sm"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-foreground">Short Bio</label>
            <textarea
              name="bio_short"
              defaultValue={guitarist.bio_short}
              rows={2}
              className="mt-1 block w-full rounded-lg border border-border px-3 py-2 text-sm"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-foreground">Full Bio</label>
            <textarea
              name="bio_full"
              defaultValue={guitarist.bio_full || ""}
              rows={4}
              className="mt-1 block w-full rounded-lg border border-border px-3 py-2 text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="featured"
              id="featured"
              defaultChecked={guitarist.featured}
              className="rounded border-border"
            />
            <label htmlFor="featured" className="text-sm font-medium text-foreground">
              Featured Guitarist
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="mt-6 rounded-full bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>

      {/* Related content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-background p-6">
          <h3 className="font-semibold text-foreground">Videos ({videos.length})</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {videos.map((v) => (
              <li key={v.id} className="truncate text-muted">
                <a href={v.youtube_url} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                  {v.title || v.youtube_url}
                </a>
              </li>
            ))}
            {videos.length === 0 && <li className="text-muted">No videos</li>}
          </ul>
        </div>

        <div className="rounded-xl border border-border bg-background p-6">
          <h3 className="font-semibold text-foreground">Tabs ({tabs.length})</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {tabs.map((t) => (
              <li key={t.id} className="truncate text-muted">
                <a href={t.external_url} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                  {t.title}
                </a>
              </li>
            ))}
            {tabs.length === 0 && <li className="text-muted">No tabs</li>}
          </ul>
        </div>

        <div className="rounded-xl border border-border bg-background p-6">
          <h3 className="font-semibold text-foreground">Social Links ({socials.length})</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {socials.map((s) => (
              <li key={s.id} className="truncate text-muted">
                <span className="font-medium capitalize">{s.platform}</span>:{" "}
                <a href={s.external_url} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                  {s.external_url}
                </a>
              </li>
            ))}
            {socials.length === 0 && <li className="text-muted">No social links</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}
