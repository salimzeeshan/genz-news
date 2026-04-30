import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchArticles } from "../api/articles";

const ArticlesContext = createContext();

export function ArticlesProvider({ children }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  async function loadArticles() {
    try {
      setError(null);
      const data = await fetchArticles();
      setArticles(data);
    } catch (err) {
      setError("Could not load articles. Is your backend running?");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function refresh() {
    setRefreshing(true);
    await loadArticles();
    setRefreshing(false);
  }

  useEffect(() => {
    loadArticles();
  }, []);

  return (
    <ArticlesContext.Provider
      value={{
        articles,
        loading,
        error,
        refreshing: !!refreshing,
        refresh,
      }}
    >
      {children}
    </ArticlesContext.Provider>
  );
}

export function useArticles() {
  return useContext(ArticlesContext);
}
