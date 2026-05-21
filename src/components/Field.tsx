import { Text, TextInput, View } from "react-native";

import { styles } from "../styles";

type FieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  multiline?: boolean;
};

export function Field({ label, value, onChangeText, multiline }: FieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.textArea]}
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        placeholderTextColor="#7C756A"
      />
    </View>
  );
}
