import { Pressable, Text, View } from "react-native";

import { PrimaryButton, SecondaryButton } from "../components/Button";
import { ChoiceChips } from "../components/ChoiceChips";
import { Field } from "../components/Field";
import { Notice } from "../components/Notice";
import { identityGroups } from "../data/mockData";
import { styles } from "../styles";
import { shortUniversity } from "../utils/format";

type ProfileScreenProps = {
  displayName: string;
  bio: string;
  identity: string;
  university: string;
  universityChoices: string[];
  age: string;
  selectedTags: string[];
  notice: string;
  authError: string;
  authLoading: boolean;
  onDisplayName: (value: string) => void;
  onBio: (value: string) => void;
  onIdentity: (value: string) => void;
  onUniversity: (value: string) => void;
  onAge: (value: string) => void;
  onRemoveTag: (tag: string) => void;
  onSaveProfile: () => void;
  onSignOut?: () => void;
};

export function ProfileScreen({
  displayName,
  bio,
  identity,
  university,
  universityChoices,
  age,
  selectedTags,
  notice,
  authError,
  authLoading,
  onDisplayName,
  onBio,
  onIdentity,
  onUniversity,
  onAge,
  onRemoveTag,
  onSaveProfile,
  onSignOut
}: ProfileScreenProps) {
  const ageIsInvalid = age.length > 0 && !isWholeNumber(age);

  return (
    <>
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{displayName.slice(0, 1).toUpperCase()}</Text>
        </View>
        <View style={styles.flexOne}>
          <Text style={styles.heroTitle}>{displayName || "New user"}</Text>
          <Text style={styles.metaText}>
            {identity} | Verified {shortUniversity(university)} | Age {age}
          </Text>
        </View>
      </View>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>Verified {shortUniversity(university)}</Text>
      </View>
      <Notice text={notice} />
      <Field label="Display name" value={displayName} onChangeText={onDisplayName} />
      <Field label="Bio" value={bio} onChangeText={onBio} multiline />
      <Text style={styles.sectionTitle}>Identity group</Text>
      <ChoiceChips choices={identityGroups} selected={identity} onSelect={onIdentity} />
      <Text style={styles.sectionTitle}>University badge</Text>
      <ChoiceChips choices={universityChoices} selected={university} onSelect={onUniversity} />
      <Field label="Age" value={age} onChangeText={onAge} keyboardType="number-pad" />
      {ageIsInvalid ? <Text style={styles.errorText}>Age must be a whole number.</Text> : null}
      <Text style={styles.sectionTitle}>Profile interests</Text>
      <View style={styles.tagWrap}>
        {selectedTags.map((tag) => (
          <Pressable key={tag} style={styles.tagChip} onPress={() => onRemoveTag(tag)}>
            <Text style={styles.tagText}>{tag} x</Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.mediaGrid}>
        <View style={styles.mediaTile}>
          <Text style={styles.mediaText}>Photo</Text>
        </View>
        <View style={styles.mediaTile}>
          <Text style={styles.mediaText}>Video</Text>
        </View>
        <View style={styles.mediaTile}>
          <Text style={styles.mediaText}>Add</Text>
        </View>
      </View>
      {authError ? <Text style={styles.errorText}>{authError}</Text> : null}
      <PrimaryButton
        label={authLoading ? "Saving..." : "Save profile"}
        onPress={onSaveProfile}
        disabled={authLoading || !displayName.trim() || !isWholeNumber(age)}
      />
      {onSignOut ? <SecondaryButton label="Sign out" onPress={onSignOut} disabled={authLoading} /> : null}
    </>
  );
}

function isWholeNumber(value: string) {
  return /^\d+$/.test(value.trim());
}
