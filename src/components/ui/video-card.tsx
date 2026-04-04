import Image from "next/image";
import Link from "next/link";
import { getYouTubeThumbnail } from "@/lib/utils";

interface VideoCardProps {
  video: {
    id?: string;
    youtube_url: string;
    title: string | null;
    thumbnail_url: string | null;
  };
  guitaristName?: string;
  guitaristSlug?: string;
}

export function VideoCard({ video, guitaristName, guitaristSlug }: VideoCardProps) {
  const thumbnail = video.thumbnail_url || getYouTubeThumbnail(video.youtube_url);
  const href = video.id ? `/videos/${video.id}` : video.youtube_url;
  const isInternal = !!video.id;

  const linkProps = isInternal
    ? {}
    : { target: "_blank" as const, rel: "noopener noreferrer" };

  return (
    <div className="group overflow-hidden rounded-xl border border-border bg-background transition-shadow hover:shadow-lg">
      <Link
        href={href}
        {...linkProps}
        className="relative block aspect-video overflow-hidden bg-gray-200"
      >
        {thumbnail && (
          <Image
            src={thumbnail}
            alt={video.title || "Video thumbnail"}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/20">
          <div className="rounded-full bg-white/90 p-3 shadow-lg">
            <svg className="h-6 w-6 text-foreground" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </Link>
      <div className="p-4">
        <h3 className="line-clamp-2 text-sm font-medium text-foreground">
          {isInternal ? (
            <Link href={href} className="hover:text-primary">
              {video.title || "Untitled Video"}
            </Link>
          ) : (
            video.title || "Untitled Video"
          )}
        </h3>
        {guitaristName && guitaristSlug && (
          <Link
            href={`/guitarists/${guitaristSlug}`}
            className="mt-1 block text-sm text-muted hover:text-primary"
          >
            {guitaristName}
          </Link>
        )}
      </div>
    </div>
  );
}
