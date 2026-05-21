import { Text, View } from "react-native";

import { styles } from "../styles";

type NoticeProps = {
  text: string;
};

export function Notice({ text }: NoticeProps) {
  if (!text) {
    return null;
  }

  return (
    <View style={styles.notice}>
      <Text style={styles.noticeText}>{text}</Text>
    </View>
  );
}
