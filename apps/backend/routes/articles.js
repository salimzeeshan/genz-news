const express = require("express");
const router = express.Router();
const {
  getPublishedArticles,
  getPendingArticles,
  updateArticleStatus,
} = require("../database/supabase");
const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
);

// PATCH /api/articles/publish-all — publishes every pending article at once
router.patch("/publish-all", adminOnly, async (req, res) => {
  try {
    const { error } = await supabase
      .from("articles")
      .update({ status: "published" })
      .eq("status", "pending");
    if (error) throw error;
    res.json({ success: true, message: "All pending articles published" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Simple admin auth middleware
// In production use proper auth — this is fine for personal projects
function adminOnly(req, res, next) {
  const token = req.headers["x-admin-token"];
  if (token !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

// GET /api/articles — mobile app fetches published articles
router.get("/", async (req, res) => {
  try {
    const articles = await getPublishedArticles();
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/articles/pending — admin panel fetches articles to review
router.get("/pending", adminOnly, async (req, res) => {
  try {
    const articles = await getPendingArticles();
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/articles/:id — admin approves or rejects an article
// Body: { "status": "published" } or { "status": "rejected" }
router.patch("/:id", adminOnly, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["published", "rejected"].includes(status)) {
    return res
      .status(400)
      .json({ error: "Status must be published or rejected" });
  }

  try {
    await updateArticleStatus(id, status);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
