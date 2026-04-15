const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
);

// Check if an article URL has already been processed
async function articleExists(urlHash) {
  const { data } = await supabase
    .from("articles")
    .select("id")
    .eq("url_hash", urlHash)
    .single();
  return !!data;
}

// Save a new article with status = 'pending'
async function saveArticle(article) {
  const { error } = await supabase.from("articles").insert(article);
  if (error) console.error("DB save error:", error.message);
}

// Get all published articles (for the mobile app)
async function getPublishedArticles() {
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

// Get all pending articles (for the admin panel)
async function getPendingArticles() {
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

// Update status to 'published' or 'rejected'
async function updateArticleStatus(id, status) {
  const { error } = await supabase
    .from("articles")
    .update({ status })
    .eq("id", id);
  if (error) throw error;
}

module.exports = {
  articleExists,
  saveArticle,
  getPublishedArticles,
  getPendingArticles,
  updateArticleStatus,
};
