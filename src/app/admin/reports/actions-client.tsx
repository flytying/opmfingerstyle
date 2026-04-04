"use client";

import { useRouter } from "next/navigation";
import { dismissReport, removeVideoWithStrike } from "./actions";

export function ReportActions({ reportId, videoId, guitaristId }: { reportId: string; videoId: string; guitaristId: string }) {
  const router = useRouter();

  async function handleRemove() {
    if (!confirm("Remove this video and add a strike to the guitarist? (3 strikes = account disabled)")) return;
    await removeVideoWithStrike(reportId, videoId, guitaristId);
    router.refresh();
  }

  async function handleDismiss() {
    if (!confirm("Dismiss this report? No action will be taken.")) return;
    await dismissReport(reportId);
    router.refresh();
  }

  return (
    <div className="flex shrink-0 gap-3">
      <button
        onClick={handleRemove}
        className="rounded-full bg-red-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-red-700"
      >
        Remove & Strike
      </button>
      <button
        onClick={handleDismiss}
        className="rounded-full border border-border px-4 py-1.5 text-sm font-medium text-muted hover:text-foreground"
      >
        Dismiss
      </button>
    </div>
  );
}
