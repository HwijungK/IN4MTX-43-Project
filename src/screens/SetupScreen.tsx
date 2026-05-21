import { Text } from "react-native";

import { PrimaryButton, SecondaryButton } from "../components/Button";
import { ChoiceChips } from "../components/ChoiceChips";
import { Field } from "../components/Field";
import { Header } from "../components/Header";
import { Screen } from "../components/Screen";
import { TagPicker } from "../components/Tags";
import { identityGroups, universities } from "../data/mockData";
import { styles } from "../styles";

type SetupScreenProps = {
  displayName: string;
  identity: string;
  university: string;
  ageRange: string;
  selectedTags: string[];
  authError: string;
  authLoading: boolean;
  onDisplayName: (value: string) => void;
  onIdentity: (value: string) => void;
  onUniversity: (value: string) => void;
  onAgeRange: (value: string) => void;
  onSelectedTags: (updater: (current: string[]) => string[]) => void;
  onEnterApp: () => void;
  onBackToLogin: () => void;
};

export function SetupScreen({
  displayName,
  identity,
  university,
  ageRange,
  selectedTags,
  authError,
  authLoading,
  onDisplayName,
  onIdentity,
  onUniversity,
  onAgeRange,
  onSelectedTags,
  onEnterApp,
  onBackToLogin
}: SetupScreenProps) {
  return (
    <Screen>
      <Header title="Campus setup" subtitle="Set the friend group CommonGround should build around you." />
      <Field label="Display name" value={displayName} onChangeText={onDisplayName} />
      <Text style={styles.sectionTitle}>Who are you?</Text>
      <ChoiceChips choices={identityGroups} selected={identity} onSelect={onIdentity} />
      <Text style={styles.sectionTitle}>University</Text>
      <ChoiceChips choices={universities} selected={university} onSelect={onUniversity} />
      <Field label="Age range" value={ageRange} onChangeText={onAgeRange} />
      <Text style={styles.sectionTitle}>Starter interests</Text>
      <TagPicker
        selectedTags={selectedTags}
        onToggle={(tag) =>
          onSelectedTags((current) =>
            current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag]
          )
        }
      />
      {authError ? <Text style={styles.errorText}>{authError}</Text> : null}
      <PrimaryButton
        label={authLoading ? "Saving..." : "Enter app"}
        onPress={onEnterApp}
        disabled={authLoading}
      />
      <SecondaryButton label="Back to login" onPress={onBackToLogin} disabled={authLoading} />
    </Screen>
  );
}
