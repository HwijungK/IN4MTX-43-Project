import { Text, TextInput, View } from "react-native";
import type { KeyboardTypeOptions } from "react-native";

import { styles } from "../styles";

type FieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  keyboardType?: KeyboardTypeOptions;
  multiline?: boolean;
};

export function Field({ label, value, onChangeText, keyboardType, multiline }: FieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.textArea]}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        multiline={multiline}
        placeholderTextColor="#7C756A"
      />
    </View>
  );
}
