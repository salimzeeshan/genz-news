import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as WebBrowser from "expo-web-browser";

export default function ArticleScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { article } = route.params; // article passed from FeedScreen

  // Opens the original article URL in an in-app browser
  async function openOriginal() {
    await WebBrowser.openBrowserAsync(article.original_url);
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <ScrollView>
        {/* Back button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        {article.image_url && (
          <Image
            source={{ uri: article.image_url }}
            style={styles.image}
            resizeMode="cover"
          />
        )}

        <View style={styles.content}>
          {/* Category */}
          <Text style={styles.category}>{article.category?.toUpperCase()}</Text>

          {/* Gen Z title */}
          <Text style={styles.title}>{article.genz_title}</Text>

          {/* Source */}
          <Text style={styles.source}>
            via {article.original_source} ·{" "}
            {new Date(article.created_at).toLocaleDateString()}
          </Text>

          {/* Full Gen Z summary */}
          <Text style={styles.summary}>{article.genz_summary}</Text>

          {/* Read original article button */}
          <TouchableOpacity style={styles.readButton} onPress={openOriginal}>
            <Text style={styles.readButtonText}>
              Read the full article (no cap)
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  backButton: {
    padding: 16,
  },
  backText: {
    fontSize: 16,
    color: "#333",
  },
  image: {
    width: "100%",
    height: 240,
  },
  content: {
    padding: 20,
  },
  category: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1,
    color: "#888",
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    lineHeight: 34,
    color: "#111",
  },
  source: {
    fontSize: 13,
    color: "#aaa",
    marginTop: 8,
    marginBottom: 20,
  },
  summary: {
    fontSize: 17,
    lineHeight: 27,
    color: "#333",
  },
  readButton: {
    marginTop: 32,
    backgroundColor: "#111",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  readButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
});
