"use client";

import { useState } from "react";
import { reportVideo } from "@/app/videos/[slug]/report-action";

export function ReportVideoButton({ videoId }: { videoId: string }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  async function handleReport(formData: FormData) {
    setStatus("sending");
    formData.set("video_id", videoId);
    await reportVideo(formData);
    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <p className="mt-4 text-center text-sm text-green-700">
        Report submitted. Thank you.
      </p>
    );
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="mt-4 flex w-full items-center justify-center gap-2 text-sm text-muted hover:text-red-600"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5" />
        </svg>
        Report this video
      </button>
    );
  }

  return (
    <form action={handleReport} className="mt-4 space-y-2">
      <select
        name="reason"
        required
        className="block w-full appearance-none rounded-lg border border-gray-300 py-2 pl-3 pr-10 text-sm"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='2' stroke='%23737373'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='m19.5 8.25-7.5 7.5-7.5-7.5'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 0.75rem center", backgroundSize: "1rem" }}
      >
        <option value="">Select reason</option>
        <option value="Inappropriate content">Inappropriate content</option>
        <option value="Copyright violation">Copyright violation</option>
        <option value="Spam or misleading">Spam or misleading</option>
        <option value="Broken or wrong video">Broken or wrong video</option>
        <option value="Other">Other</option>
      </select>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={status === "sending"}
          className="rounded-full bg-red-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
        >
          {status === "sending" ? "Sending..." : "Submit Report"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-full border border-border px-4 py-1.5 text-sm font-medium text-muted hover:text-foreground"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
