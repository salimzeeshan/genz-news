import React from "react";
import { ActivityIndicator, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "../theme/colors";

export default function LoadingSpinner({ message = "Loading..." }) {
  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <ActivityIndicator size="large" color={colors.ink} />
      <Text style={styles.text}>{message}</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  text: {
    marginTop: 12,
    fontSize: 14,
    color: colors.muted,
  },
});
