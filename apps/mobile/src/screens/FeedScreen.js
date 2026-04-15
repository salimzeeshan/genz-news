import React, { useRef } from "react";
import {
  FlatList,
  View,
  Text,
  useWindowDimensions,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useArticles } from "../context/ArticlesContext";
import ArticleCard from "../components/ArticleCard";
import LoadingSpinner from "../components/LoadingSpinner";

export default function FeedScreen() {
  const { articles, loading, error, refreshing, refresh } = useArticles();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const listRef = useRef(null);
  const cardHeight = (height - insets.top) * 0.82;
  const snapInterval = cardHeight + 16;

  if (loading) return <LoadingSpinner message="fetching the news fr fr..." />;

  if (error) {
    return (
      <SafeAreaView style={styles.errorContainer} edges={["top"]}>
        <Text style={styles.errorText}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <FlatList
        ref={listRef}
        data={articles}
        keyExtractor={(item) => item.id}
        // Each card snaps to fill the safe screen area.
        pagingEnabled
        snapToInterval={snapInterval}
        snapToAlignment="start"
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={!!refreshing} onRefresh={refresh} />
        }
        renderItem={({ item }) => (
          <ArticleCard
            article={item}
            height={cardHeight}
            onPress={() =>
              // Pass full article data to ArticleScreen via navigation params
              navigation.navigate("Article", { article: item })
            }
          />
        )}
        // Performance optimisations for large lists
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
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  errorText: {
    fontSize: 15,
    color: "#e00",
    textAlign: "center",
  },
});
