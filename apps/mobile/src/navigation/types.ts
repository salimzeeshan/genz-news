import type { NavigationProp, RouteProp } from "@react-navigation/native";
import type { Article } from "../types/article";

export type AppStackParamList = {
  Feed: undefined;
  Categories: undefined;
  Article: { article: Article };
};

export type AppNavigationProp = NavigationProp<AppStackParamList>;
export type ArticleRouteProp = RouteProp<AppStackParamList, "Article">;
