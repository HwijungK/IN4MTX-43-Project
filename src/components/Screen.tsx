import type { ReactNode } from "react";
import { SafeAreaView, ScrollView, StatusBar } from "react-native";

import { styles } from "../styles";

type ScreenProps = {
  children: ReactNode;
};

export function Screen({ children }: ScreenProps) {
  return (
    <SafeAreaView style={styles.appRoot}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

export function ScrollableScreen({ children }: ScreenProps) {
  return (
    <ScrollView
      style={styles.appRoot}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator
    >
      {children}
    </ScrollView>
  );
}
