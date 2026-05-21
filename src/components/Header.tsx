import { Text, View } from "react-native";

import { styles } from "../styles";

type HeaderProps = {
  title: string;
  subtitle: string;
};

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <View style={styles.header}>
      <Text style={styles.heroTitle}>{title}</Text>
      <Text style={styles.bodyText}>{subtitle}</Text>
    </View>
  );
}
