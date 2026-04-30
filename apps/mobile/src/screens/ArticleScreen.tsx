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
import colors from "../theme/colors";
import type {
  AppNavigationProp,
  ArticleRouteProp,
} from "../navigation/types";

export default function ArticleScreen() {
  const route = useRoute<ArticleRouteProp>();
  const navigation = useNavigation<AppNavigationProp>();
  const { article } = route.params;

  async function openOriginal() {
    await WebBrowser.openBrowserAsync(article.original_url);
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <ScrollView>
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
          <Text style={styles.category}>{article.category?.toUpperCase()}</Text>

          <Text style={styles.title}>{article.genz_title}</Text>

          <Text style={styles.source}>
            via {article.original_source} ·{" "}
            {new Date(article.created_at).toLocaleDateString()}
          </Text>

          <Text style={styles.summary}>{article.genz_summary}</Text>

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
    backgroundColor: colors.background,
  },
  backButton: {
    padding: 16,
  },
  backText: {
    fontSize: 16,
    color: colors.ink,
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
    color: colors.muted,
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    lineHeight: 34,
    color: colors.ink,
  },
  source: {
    fontSize: 13,
    color: colors.muted,
    marginTop: 8,
    marginBottom: 20,
  },
  summary: {
    fontSize: 17,
    lineHeight: 27,
    color: colors.ink,
  },
  readButton: {
    marginTop: 32,
    backgroundColor: colors.ink,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  readButtonText: {
    color: colors.background,
    fontSize: 15,
    fontWeight: "600",
  },
});
