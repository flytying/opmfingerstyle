import Image from "next/image";
import Link from "next/link";

interface VideoCardProps {
  video: {
    youtube_url: string;
    title: string | null;
    thumbnail_url: string | null;
  };
  guitaristName?: string;
  guitaristSlug?: string;
}

function getYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/))([a-zA-Z0-9_-]{11})/
  );
  return match?.[1] ?? null;
}

function getYouTubeThumbnail(url: string): string | null {
  const id = getYouTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : null;
}

export function VideoCard({ video, guitaristName, guitaristSlug }: VideoCardProps) {
  const thumbnail = video.thumbnail_url || getYouTubeThumbnail(video.youtube_url);

  return (
    <div className="group overflow-hidden rounded-xl border border-border bg-background transition-shadow hover:shadow-lg">
      <a
        href={video.youtube_url}
        target="_blank"
        rel="noopener noreferrer"
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
      </a>
      <div className="p-4">
        <h3 className="line-clamp-2 text-sm font-medium text-foreground">
          {video.title || "Untitled Video"}
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
