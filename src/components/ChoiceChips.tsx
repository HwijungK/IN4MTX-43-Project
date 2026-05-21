import { Pressable, Text, View } from "react-native";

import { styles } from "../styles";

type ChoiceChipsProps = {
  choices: string[];
  selected: string;
  onSelect: (choice: string) => void;
};

export function ChoiceChips({ choices, selected, onSelect }: ChoiceChipsProps) {
  return (
    <View style={styles.tagWrap}>
      {choices.map((choice) => {
        const isSelected = choice === selected;
        return (
          <Pressable
            key={choice}
            style={[styles.choiceChip, isSelected && styles.choiceChipSelected]}
            onPress={() => onSelect(choice)}
          >
            <Text style={[styles.choiceText, isSelected && styles.choiceTextSelected]}>{choice}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
