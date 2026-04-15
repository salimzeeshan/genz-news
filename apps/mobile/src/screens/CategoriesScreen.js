import React, { useRef, useState } from "react";
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
const CATEGORY_RAIL_HEIGHT = 58;

export default function CategoriesScreen() {
  const { articles } = useArticles();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const listRef = useRef(null);
  const [selected, setSelected] = useState("all");
  const cardHeight = (height - insets.top - CATEGORY_RAIL_HEIGHT) * 0.82;
  const snapInterval = cardHeight + 16;

  const filtered =
    selected === "all"
      ? articles
      : articles.filter((a) => a.category === selected);

  function selectCategory(category) {
    setSelected(category);
    listRef.current?.scrollToOffset({ offset: 0, animated: false });
  }

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
            onPress={() => selectCategory(item)}
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
        ref={listRef}
        data={filtered}
        keyExtractor={(item) => item.id}
        pagingEnabled
        snapToInterval={snapInterval}
        snapToAlignment="start"
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
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
        removeClippedSubviews
        maxToRenderPerBatch={5}
        windowSize={5}
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
    height: CATEGORY_RAIL_HEIGHT,
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
