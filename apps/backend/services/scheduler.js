const cron = require("node-cron");
const crypto = require("crypto");
const { fetchNews } = require("./newsApi");
const { rewriteArticle } = require("./aiRewrite");
const { articleExists, saveArticle } = require("../database/supabase");

async function runPipeline() {
  console.log("Pipeline started:", new Date().toISOString());

  const articles = await fetchNews();
  console.log(`Fetched ${articles.length} articles`);

  let saved = 0;
  let skipped = 0;

  for (const article of articles) {
    const hash = crypto.createHash("md5").update(article.url).digest("hex");

    // Skip if already processed
    if (await articleExists(hash)) {
      skipped++;
      continue;
    }

    const rewritten = await rewriteArticle(article);
    if (!rewritten) continue; // skip if AI failed

    await saveArticle({ ...rewritten, url_hash: hash, status: "pending" });
    saved++;

    // Small delay to avoid hammering Groq rate limits
    await new Promise((r) => setTimeout(r, 500));
  }

  console.log(`Done. Saved: ${saved}, Skipped (duplicates): ${skipped}`);
}

// Run every 4 hours: minute 0, every 4th hour
cron.schedule("0 */4 * * *", runPipeline);

// Also run once immediately when server starts
runPipeline();
