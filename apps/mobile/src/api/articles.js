import axios from "axios";

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
});

export async function fetchArticles() {
  const response = await api.get("/articles");
  return response.data;
}

export async function fetchByCategory(category) {
  const response = await api.get("/articles", {
    params: { category },
  });
  return response.data;
}
