"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

interface Props {
  artists: { slug: string; display_name: string }[];
}

export function TabSearchFilter({ artists }: Props) {
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
      router.replace(`/tabs?${params.toString()}`);
    });
  }

  function handleClear() {
    setQuery("");
    updateParams("", "");
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
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); updateParams(e.target.value, currentArtist); }}
          placeholder="Search tabs by title or song..."
          className="w-full rounded-lg border border-gray-300 bg-background py-2.5 pl-10 pr-10 text-sm text-foreground placeholder:text-gray-400 focus:border-primary focus:ring-1 focus:ring-primary"
        />
        {query || currentArtist ? (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-foreground"
            aria-label="Clear search"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        ) : isPending ? (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-primary" />
          </div>
        ) : null}
      </div>
      <select
        value={currentArtist}
        onChange={(e) => updateParams(query, e.target.value)}
        className="appearance-none rounded-lg border border-gray-300 bg-background py-2.5 pl-4 pr-10 text-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='2' stroke='%23737373'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='m19.5 8.25-7.5 7.5-7.5-7.5'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 0.75rem center", backgroundSize: "1rem" }}
      >
        <option value="">All Artists</option>
        {artists.map((a) => (
          <option key={a.slug} value={a.slug}>{a.display_name}</option>
        ))}
      </select>
    </div>
  );
}
