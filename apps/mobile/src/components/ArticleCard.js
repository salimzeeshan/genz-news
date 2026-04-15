import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

export default function ArticleCard({ article, height, onPress }) {
  const cardHeight = height || 620;
  const titleLines = cardHeight >= 640 ? 3 : 2;
  const summaryLines = Math.max(
    2,
    Math.min(10, Math.floor((cardHeight * 0.55 - 158) / 23))
  );

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
          <Text
            style={styles.categoryText}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {article.category?.toUpperCase()}
          </Text>
        </View>

        {/* Gen Z title */}
        <Text
          style={styles.title}
          numberOfLines={titleLines}
          ellipsizeMode="tail"
        >
          {article.genz_title}
        </Text>

        {/* Gen Z summary */}
        <Text
          style={styles.summary}
          numberOfLines={summaryLines}
          ellipsizeMode="tail"
        >
          {article.genz_summary}
        </Text>

        {/* Source + time */}
        <View style={styles.footer}>
          <Text style={styles.source} numberOfLines={1} ellipsizeMode="tail">
            {article.original_source}
          </Text>
          <Text style={styles.time} numberOfLines={1} ellipsizeMode="tail">
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
    overflow: "hidden",
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
    flexShrink: 0,
  },
  summary: {
    fontSize: 15,
    lineHeight: 23,
    color: "#444",
    flex: 1,
    flexShrink: 1,
    marginTop: 12,
    overflow: "hidden",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  source: {
    flex: 1,
    fontSize: 12,
    color: "#999",
    fontWeight: "500",
    marginRight: 8,
  },
  time: {
    fontSize: 12,
    color: "#999",
  },
});
