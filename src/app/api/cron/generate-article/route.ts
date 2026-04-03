import { NextResponse } from "next/server";
import { runArticleGeneration } from "@/lib/article-agent";

export async function GET(request: Request) {
  // Verify cron secret (Vercel sets this automatically for cron jobs)
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await runArticleGeneration();
    return NextResponse.json({
      success: true,
      article: {
        id: result.id,
        slug: result.slug,
        title: result.title,
        topic: result.topic,
      },
    });
  } catch (err) {
    console.error("[cron] Article generation failed:", err);
    return NextResponse.json(
      { error: "Article generation failed", details: String(err) },
      { status: 500 }
    );
  }
}
