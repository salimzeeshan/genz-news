const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

const SYSTEM_PROMPT = `You are a Gen Z news writer. Your job is to rewrite news articles 
in a fun, casual Gen Z style. Use words like "lowkey", "no cap", "it's giving", "slay", 
"bussin", "fr fr", "not gonna lie" etc. Keep it factual but make it entertaining.
Always respond with ONLY valid JSON, no extra text.`;

async function rewriteArticle(article) {
  try {
    const userPrompt = `
Rewrite this news article in Gen Z language.

Title: ${article.title}
Description: ${article.description}
Source: ${article.source?.name || "Unknown"}

Return ONLY this JSON format:
{
  "genz_title": "catchy Gen Z title here",
  "genz_summary": "80-100 word Gen Z summary here",
  "category": "one of: world, tech, sports, entertainment, science, business"
}`;

    const response = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      max_tokens: 400,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
    });

    const raw = response.choices[0].message.content;

    const clean = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    return {
      original_title: article.title,
      original_url: article.url,
      original_source: article.source?.name || "Unknown",
      image_url: article.urlToImage || null,
      genz_title: parsed.genz_title,
      genz_summary: parsed.genz_summary,
      category: parsed.category,
    };
  } catch (err) {
    console.error("AI rewrite error:", err.message);
    return null;
  }
}

module.exports = { rewriteArticle };
