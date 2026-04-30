import axios from "axios";
import type { Article } from "../types/article";

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
});

export async function fetchArticles(): Promise<Article[]> {
  const response = await api.get<Article[]>("/articles");
  return response.data;
}

export async function fetchByCategory(category: string): Promise<Article[]> {
  const response = await api.get<Article[]>("/articles", {
    params: { category },
  });
  return response.data;
}
