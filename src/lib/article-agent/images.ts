export async function getUnsplashImage(keywords: string): Promise<string | null> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) {
    console.log("[images] UNSPLASH_ACCESS_KEY not set, skipping image");
    return null;
  }

  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(keywords)}&orientation=landscape&per_page=1`,
      {
        headers: { Authorization: `Client-ID ${accessKey}` },
      }
    );

    if (!res.ok) {
      console.error("[images] Unsplash API error:", res.status);
      return null;
    }

    const data = await res.json();
    const photo = data.results?.[0];
    if (!photo) return null;

    // Use regular size with UTM attribution (Unsplash requirement)
    return `${photo.urls.regular}&w=1200&h=630&fit=crop`;
  } catch (err) {
    console.error("[images] Failed to fetch Unsplash image:", err);
    return null;
  }
}
