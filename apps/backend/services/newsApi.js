const axios = require("axios");

async function fetchNews() {
  try {
    const response = await axios.get("https://newsapi.org/v2/top-headlines", {
      params: {
        language: "en",
        pageSize: 20, // fetch 20 articles per run
        apiKey: process.env.NEWSAPI_KEY,
      },
    });

    // Filter out articles with no content or URL
    return response.data.articles.filter(
      (a) => a.url && a.title && a.description,
    );
  } catch (err) {
    console.error("NewsAPI error:", err.message);
    return [];
  }
}

module.exports = { fetchNews };
