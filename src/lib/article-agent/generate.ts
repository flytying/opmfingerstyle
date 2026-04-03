import Anthropic from "@anthropic-ai/sdk";
import type { Topic } from "./topics";
import type { ResearchData } from "./research";

export interface GeneratedArticle {
  title: string;
  slug: string;
  excerpt: string;
  body: string;
}

const SYSTEM_PROMPT = `You are a content writer for OPM Fingerstyle (opmfingerstyle.com), a niche website dedicated to Filipino fingerstyle guitarists performing Original Pilipino Music (OPM) songs.

Your writing style is:
- Warm, knowledgeable, and conversational
- Written for Filipino guitar enthusiasts (mix of English with occasional Filipino context)
- SEO-optimized but natural — not keyword-stuffed
- Actionable and useful — readers should learn something or discover something new
- Proud of Filipino musical heritage

Output format: Return ONLY valid JSON with these fields:
{
  "title": "SEO-friendly title (50-65 characters)",
  "slug": "url-friendly-slug",
  "excerpt": "Compelling meta description (120-155 characters)",
  "body": "Full article in HTML using <h2>, <h3>, <p>, <ul>/<li>, <strong>, <em> tags. 800-1200 words. Include 3-5 subheadings."
}`;

export async function generateArticle(
  topic: Topic,
  research: ResearchData[],
  recentTitles: string[]
): Promise<GeneratedArticle> {
  const client = new Anthropic();

  const researchContext = research
    .flatMap((r) =>
      r.results.map((item) => `- ${item.title}: ${item.snippet}`)
    )
    .join("\n");

  const exclusions =
    recentTitles.length > 0
      ? `\n\nIMPORTANT: Do NOT write about these topics (already covered recently):\n${recentTitles.map((t) => `- ${t}`).join("\n")}`
      : "";

  const userPrompt = `Write an article about: ${topic.name}

Guidance: ${topic.guidance}

Here is current research context from the web:
${researchContext || "No research data available — use your knowledge of OPM and fingerstyle guitar."}
${exclusions}

Remember: Return ONLY valid JSON. The body should be well-structured HTML with proper headings, paragraphs, and lists. Write 800-1200 words.`;

  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userPrompt }],
  });

  const content = message.content[0];
  if (content.type !== "text") {
    throw new Error("Unexpected response type from Claude API");
  }

  // Extract JSON from response (handle possible markdown wrapping)
  let jsonStr = content.text.trim();
  const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) {
    jsonStr = jsonMatch[1].trim();
  }

  const article: GeneratedArticle = JSON.parse(jsonStr);

  // Validate required fields
  if (!article.title || !article.slug || !article.excerpt || !article.body) {
    throw new Error("Generated article missing required fields");
  }

  return article;
}
