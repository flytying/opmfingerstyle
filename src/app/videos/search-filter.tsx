"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

interface Props {
  artists: { slug: string; display_name: string }[];
}

export function VideoSearchFilter({ artists }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const currentArtist = searchParams.get("artist") || "";

  function updateParams(newQ: string, newArtist: string) {
    startTransition(() => {
      const params = new URLSearchParams();
      if (newQ) params.set("q", newQ);
      if (newArtist) params.set("artist", newArtist);
      router.replace(`/videos?${params.toString()}`);
    });
  }

  function handleSearch(value: string) {
    setQuery(value);
    updateParams(value, currentArtist);
  }

  function handleArtist(value: string) {
    updateParams(query, value);
  }

  return (
    <div className="mb-8 flex flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <svg
          className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search videos by title..."
          className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-gray-400 focus:border-primary focus:ring-1 focus:ring-primary"
        />
        {isPending && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-primary" />
          </div>
        )}
      </div>
      <select
        value={currentArtist}
        onChange={(e) => handleArtist(e.target.value)}
        className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary"
      >
        <option value="">All Artists</option>
        {artists.map((a) => (
          <option key={a.slug} value={a.slug}>{a.display_name}</option>
        ))}
      </select>
    </div>
  );
}
