import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { fetchArticles } from "../api/articles";
import type { Article } from "../types/article";

type ArticlesContextValue = {
  articles: Article[];
  loading: boolean;
  error: string | null;
  refreshing: boolean;
  refresh: () => Promise<void>;
};

const ArticlesContext = createContext<ArticlesContextValue | undefined>(undefined);

type ArticlesProviderProps = {
  children: ReactNode;
};

export function ArticlesProvider({ children }: ArticlesProviderProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
        refreshing,
        refresh,
      }}
    >
      {children}
    </ArticlesContext.Provider>
  );
}

export function useArticles(): ArticlesContextValue {
  const context = useContext(ArticlesContext);

  if (!context) {
    throw new Error("useArticles must be used within an ArticlesProvider");
  }

  return context;
}
