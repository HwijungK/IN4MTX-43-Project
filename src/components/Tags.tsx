import { Pressable, Text, View } from "react-native";

import { interests } from "../data/mockData";
import { styles } from "../styles";

type TagPickerProps = {
  selectedTags: string[];
  onToggle: (tag: string) => void;
};

export function TagPicker({ selectedTags, onToggle }: TagPickerProps) {
  return (
    <View style={styles.tagWrap}>
      {interests.map((interest) => {
        const selected = selectedTags.includes(interest.label);
        return (
          <Pressable
            key={interest.id}
            style={[styles.tagChip, selected && styles.tagChipSelected]}
            onPress={() => onToggle(interest.label)}
          >
            <Text style={[styles.tagText, selected && styles.tagTextSelected]}>
              {interest.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function TagRow({ tags }: { tags: string[] }) {
  return (
    <View style={styles.tagWrap}>
      {tags.map((tag) => (
        <View key={tag} style={styles.tagChip}>
          <Text style={styles.tagText}>{tag}</Text>
        </View>
      ))}
    </View>
  );
}
