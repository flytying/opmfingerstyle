import "dotenv/config";
import { runArticleGeneration } from "../src/lib/article-agent";

async function main() {
  try {
    const result = await runArticleGeneration();
    console.log("\n✅ Article published successfully!");
    console.log(`   Title: ${result.title}`);
    console.log(`   Topic: ${result.topic}`);
    console.log(`   URL: https://opmfingerstyle.com/blog/${result.slug}`);
  } catch (err) {
    console.error("\n❌ Article generation failed:", err);
    process.exit(1);
  }
}

main();
