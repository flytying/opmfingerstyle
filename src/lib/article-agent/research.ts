interface SearchResult {
  title: string;
  snippet: string;
  link: string;
}

export interface ResearchData {
  query: string;
  results: SearchResult[];
}

export async function searchWeb(queries: string[]): Promise<ResearchData[]> {
  const apiKey = process.env.SERPER_API_KEY;
  if (!apiKey) {
    console.log("[research] SERPER_API_KEY not set, returning empty results");
    return queries.map((q) => ({ query: q, results: [] }));
  }

  const results: ResearchData[] = [];

  for (const query of queries) {
    try {
      const res = await fetch("https://google.serper.dev/search", {
        method: "POST",
        headers: {
          "X-API-KEY": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ q: query, num: 5 }),
      });

      if (!res.ok) {
        console.error(`[research] Serper API error for "${query}":`, res.status);
        results.push({ query, results: [] });
        continue;
      }

      const data = await res.json();
      const organic: SearchResult[] = (data.organic || [])
        .slice(0, 5)
        .map((item: { title: string; snippet: string; link: string }) => ({
          title: item.title || "",
          snippet: item.snippet || "",
          link: item.link || "",
        }));

      results.push({ query, results: organic });
    } catch (err) {
      console.error(`[research] Failed to search "${query}":`, err);
      results.push({ query, results: [] });
    }
  }

  return results;
}
