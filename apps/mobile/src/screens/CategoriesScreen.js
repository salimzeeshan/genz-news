import React, { useState } from "react";
import {
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useArticles } from "../context/ArticlesContext";
import ArticleCard from "../components/ArticleCard";

const CATEGORIES = [
  "all",
  "world",
  "tech",
  "sports",
  "entertainment",
  "science",
  "business",
];

export default function CategoriesScreen() {
  const { articles } = useArticles();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const [selected, setSelected] = useState("all");
  const cardHeight = Math.min((height - insets.top - 64) * 0.72, 560);

  const filtered =
    selected === "all"
      ? articles
      : articles.filter((a) => a.category === selected);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Category filter pills */}
      <FlatList
        horizontal
        data={CATEGORIES}
        keyExtractor={(c) => c}
        style={styles.categoryRail}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.pills}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.pill, selected === item && styles.pillActive]}
            onPress={() => setSelected(item)}
          >
            <Text
              style={[
                styles.pillText,
                selected === item && styles.pillTextActive,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Filtered article list */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ArticleCard
            article={item}
            height={cardHeight}
            onPress={() => navigation.navigate("Article", { article: item })}
          />
        )}
        contentContainerStyle={styles.articleList}
        ListEmptyComponent={
          <Text style={styles.empty}>No articles in this category yet</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  categoryRail: {
    flexGrow: 0,
    height: 58,
  },
  pills: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
    marginRight: 8,
  },
  pillActive: {
    backgroundColor: "#111",
  },
  pillText: {
    fontSize: 13,
    color: "#555",
    fontWeight: "500",
    textTransform: "capitalize",
  },
  pillTextActive: {
    color: "#fff",
  },
  empty: {
    textAlign: "center",
    color: "#aaa",
    marginTop: 60,
    fontSize: 15,
  },
  articleList: {
    paddingBottom: 16,
  },
});
