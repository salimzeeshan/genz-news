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

function adminOnly(req, res, next) {
  const token = req.headers["x-admin-token"];
  if (token !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

router.get("/", async (req, res) => {
  try {
    const articles = await getPublishedArticles();
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/pending", adminOnly, async (req, res) => {
  try {
    const articles = await getPendingArticles();
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

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
