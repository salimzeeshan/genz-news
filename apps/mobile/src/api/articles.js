import axios from "axios";

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
});

// Fetch all published articles — used by FeedScreen
export async function fetchArticles() {
  const response = await api.get("/articles");
  return response.data;
}

// Fetch articles filtered by category
export async function fetchByCategory(category) {
  const response = await api.get("/articles", {
    params: { category },
  });
  return response.data;
}