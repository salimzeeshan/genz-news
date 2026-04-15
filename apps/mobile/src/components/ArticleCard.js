import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

export default function ArticleCard({ article, height, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.card, height && { height }]}
      onPress={onPress}
      activeOpacity={0.95}
    >
      {/* Cover image — falls back gracefully if null */}
      {article.image_url ? (
        <Image
          source={{ uri: article.image_url }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.imagePlaceholder} />
      )}

      <View style={styles.content}>
        {/* Category pill */}
        <View style={styles.categoryPill}>
          <Text style={styles.categoryText}>
            {article.category?.toUpperCase()}
          </Text>
        </View>

        {/* Gen Z title */}
        <Text style={styles.title}>{article.genz_title}</Text>

        {/* Gen Z summary */}
        <Text style={styles.summary}>{article.genz_summary}</Text>

        {/* Source + time */}
        <View style={styles.footer}>
          <Text style={styles.source}>{article.original_source}</Text>
          <Text style={styles.time}>
            {new Date(article.created_at).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    overflow: "hidden",
    marginHorizontal: 16,
    marginVertical: 8,
  },
  image: {
    width: "100%",
    height: "45%",
  },
  imagePlaceholder: {
    width: "100%",
    height: "45%",
    backgroundColor: "#e0e0e0",
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: "space-between",
  },
  categoryPill: {
    alignSelf: "flex-start",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 10,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1,
    color: "#555",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    lineHeight: 30,
    color: "#111",
  },
  summary: {
    fontSize: 15,
    lineHeight: 23,
    color: "#444",
    flex: 1,
    marginTop: 12,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  source: {
    fontSize: 12,
    color: "#999",
    fontWeight: "500",
  },
  time: {
    fontSize: 12,
    color: "#999",
  },
});
