export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/))([a-zA-Z0-9_-]{11})/
  );
  return match?.[1] ?? null;
}

export function getYouTubeThumbnail(url: string): string | null {
  const id = getYouTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : null;
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export const categoryLabels: Record<string, string> = {
  acoustic_guitar: "Acoustic Guitars",
  classical_guitar: "Classical Guitars",
  strings: "Strings",
  capo: "Capos",
  tuner: "Tuners",
  pickup: "Pickups",
  microphone: "Microphones",
  audio_interface: "Audio Interfaces",
  amp: "Amps",
  cable: "Cables",
  stand: "Stands",
  accessory: "Accessories",
};
