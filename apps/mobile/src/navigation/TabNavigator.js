import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Text } from "react-native";
import FeedScreen from "../screens/FeedScreen";
import ArticleScreen from "../screens/ArticleScreen";
import CategoriesScreen from "../screens/CategoriesScreen";
import colors from "../theme/colors";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function FeedStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Feed" component={FeedScreen} />
      <Stack.Screen name="Article" component={ArticleScreen} />
    </Stack.Navigator>
  );
}

function CategoriesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Categories" component={CategoriesScreen} />
      <Stack.Screen name="Article" component={ArticleScreen} />
    </Stack.Navigator>
  );
}

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.ink,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          paddingBottom: 5,
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
      }}
    >
      <Tab.Screen
        name="FeedTab"
        component={FeedStack}
        options={{
          tabBarLabel: "Feed",
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 20 }}>{focused ? "🔥" : "📰"}</Text>
          ),
        }}
      />
      <Tab.Screen
        name="CategoriesTab"
        component={CategoriesStack}
        options={{
          tabBarLabel: "Categories",
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 20 }}>{focused ? "🗂️" : "📂"}</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}
