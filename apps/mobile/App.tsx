import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ArticlesProvider } from "./src/context/ArticlesContext";
import TabNavigator from "./src/navigation/TabNavigator";

export default function App() {
  return (
    <ArticlesProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <StatusBar style="dark" />
          <TabNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </ArticlesProvider>
  );
}
