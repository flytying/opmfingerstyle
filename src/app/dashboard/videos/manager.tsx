"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { removeVideo } from "./actions";
import { getYouTubeId } from "@/lib/utils";
import type { GuitaristVideo } from "@/lib/supabase/types";

export function VideosManager({ videos }: { videos: GuitaristVideo[] }) {
  const router = useRouter();
  const [message, setMessage] = useState("");

  async function handleRemove(videoId: string) {
    if (!confirm("Remove this video?")) return;
    await removeVideo(videoId);
    router.refresh();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Your Videos ({videos.length})</h2>
        <Link
          href="/dashboard/videos/new"
          className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover"
        >
          + Add Video
        </Link>
      </div>

      {message && (
        <div className={`mt-4 rounded-lg border p-2 text-sm ${message.includes("updated") ? "border-green-200 bg-green-50 text-green-700" : "border-red-200 bg-red-50 text-red-700"}`}>
          {message}
        </div>
      )}

      {videos.length > 0 ? (
        <div className="mt-4 overflow-hidden rounded-xl border border-border bg-background">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface text-left">
                <th className="px-4 py-3 font-medium text-muted">Video</th>
                <th className="hidden px-4 py-3 font-medium text-muted md:table-cell">Date</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {videos.map((v) => {
                const ytId = getYouTubeId(v.youtube_url);
                const thumb = ytId ? `https://img.youtube.com/vi/${ytId}/mqdefault.jpg` : null;

                return (
                  <tr key={v.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {thumb ? (
                          <Image
                            src={thumb}
                            alt={v.title || ""}
                            width={120}
                            height={68}
                            className="shrink-0 rounded object-cover"
                          />
                        ) : (
                          <div className="flex h-[68px] w-[120px] shrink-0 items-center justify-center rounded bg-gray-200 text-gray-400">
                            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-medium text-foreground">{v.title || "Untitled"}</p>
                          {v.description && (
                            <p className="mt-0.5 line-clamp-1 text-xs text-muted">{v.description}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 text-muted md:table-cell">
                      {new Date(v.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-4">
                        <Link href={`/dashboard/videos/${v.id}/edit`} className="text-sm font-medium text-foreground hover:text-muted">
                          Edit
                        </Link>
                        <button onClick={() => handleRemove(v.id)} className="text-sm text-red-600 hover:text-red-800">
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-4 rounded-xl border border-border bg-background px-6 py-12 text-center">
          <p className="text-muted">No videos yet.</p>
          <Link
            href="/dashboard/videos/new"
            className="mt-3 inline-flex rounded-full bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover"
          >
            Add your first video
          </Link>
        </div>
      )}
    </div>
  );
}
