export async function getFeaturedImage(keywords: string): Promise<string | null> {
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) {
    console.log("[images] PEXELS_API_KEY not set, skipping image");
    return null;
  }

  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(keywords)}&orientation=landscape&per_page=1`,
      {
        headers: { Authorization: apiKey },
      }
    );

    if (!res.ok) {
      console.error("[images] Pexels API error:", res.status);
      return null;
    }

    const data = await res.json();
    const photo = data.photos?.[0];
    if (!photo) return null;

    return photo.src.landscape;
  } catch (err) {
    console.error("[images] Failed to fetch Pexels image:", err);
    return null;
  }
}
