import { getWeeklyTopic } from "./topics";
import { searchWeb } from "./research";
import { generateArticle } from "./generate";
import { getFeaturedImage } from "./images";
import { publishArticle, getRecentArticleTitles } from "./publish";

export async function runArticleGeneration() {
  console.log("[agent] Starting article generation...");

  // 1. Select topic for this week
  const topic = getWeeklyTopic();
  console.log(`[agent] Topic: ${topic.name} (${topic.id})`);

  // 2. Research web for current content
  console.log("[agent] Researching...");
  const research = await searchWeb(topic.searchQueries);
  const totalResults = research.reduce((sum, r) => sum + r.results.length, 0);
  console.log(`[agent] Found ${totalResults} search results`);

  // 3. Get recent titles for deduplication
  const recentTitles = await getRecentArticleTitles();
  console.log(`[agent] ${recentTitles.length} recent articles to avoid`);

  // 4. Generate article with Claude
  console.log("[agent] Generating article with Claude...");
  const article = await generateArticle(topic, research, recentTitles);
  console.log(`[agent] Generated: "${article.title}"`);

  // 5. Get featured image
  console.log("[agent] Fetching featured image...");
  const imageUrl = await getFeaturedImage(topic.unsplashKeywords);

  // 6. Publish to Supabase
  console.log("[agent] Publishing...");
  const published = await publishArticle(article, imageUrl);
  console.log(`[agent] Published! ID: ${published.id}, Slug: ${published.slug}`);

  return {
    id: published.id,
    slug: published.slug,
    title: article.title,
    topic: topic.name,
  };
}
