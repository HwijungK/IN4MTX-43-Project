import { useState } from "react";
import { Text, TextInput } from "react-native";

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
  age: string;
  selectedTags: string[];
  authError: string;
  authLoading: boolean;
  signupEmail: string;
  signupPassword: string;
  onDisplayName: (value: string) => void;
  onIdentity: (value: string) => void;
  onUniversity: (value: string) => void;
  onAge: (value: string) => void;
  onSignupEmail: (value: string) => void;
  onSignupPassword: (value: string) => void;
  onSelectedTags: (updater: (current: string[]) => string[]) => void;
  onEnterApp: () => void;
  onBackToLogin: () => void;
};

export function SetupScreen({
  displayName,
  identity,
  university,
  age,
  selectedTags,
  authError,
  authLoading,
  signupEmail,
  signupPassword,
  onDisplayName,
  onIdentity,
  onUniversity,
  onAge,
  onSignupEmail,
  onSignupPassword,
  onSelectedTags,
  onEnterApp,
  onBackToLogin
}: SetupScreenProps) {
  const [confirmPassword, setConfirmPassword] = useState("");
  const passwordsDoNotMatch = signupPassword.length > 0 && confirmPassword.length > 0 && signupPassword !== confirmPassword;
  const ageIsInvalid = age.length > 0 && !isWholeNumber(age);
  const setupDisabled =
    authLoading ||
    !signupEmail.trim() ||
    signupPassword.length < 6 ||
    passwordsDoNotMatch ||
    !isWholeNumber(age);

  return (
    <Screen>
      <Header title="Campus setup" subtitle="Set the friend group CommonGround should build around you." />
      <Text style={styles.sectionTitle}>Account credentials</Text>
      <TextInput
        style={styles.input}
        value={signupEmail}
        onChangeText={onSignupEmail}
        placeholder="University email"
        placeholderTextColor="#7C756A"
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        value={signupPassword}
        onChangeText={onSignupPassword}
        placeholder="Create password (at least 6 characters)"
        placeholderTextColor="#7C756A"
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Confirm password"
        placeholderTextColor="#7C756A"
        secureTextEntry
      />
      {signupPassword.length > 0 && signupPassword.length < 6 ? (
        <Text style={styles.errorText}>Password must be at least 6 characters.</Text>
      ) : null}
      {passwordsDoNotMatch ? <Text style={styles.errorText}>Passwords do not match.</Text> : null}
      <Field label="Display name" value={displayName} onChangeText={onDisplayName} />
      <Text style={styles.sectionTitle}>Who are you?</Text>
      <ChoiceChips choices={identityGroups} selected={identity} onSelect={onIdentity} />
      <Text style={styles.sectionTitle}>University</Text>
      <ChoiceChips choices={universities} selected={university} onSelect={onUniversity} />
      <Field label="Age" value={age} onChangeText={onAge} keyboardType="number-pad" />
      {ageIsInvalid ? <Text style={styles.errorText}>Age must be a whole number.</Text> : null}
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
        disabled={setupDisabled}
      />
      <SecondaryButton label="Back to login" onPress={onBackToLogin} disabled={authLoading} />
    </Screen>
  );
}

function isWholeNumber(value: string) {
  return /^\d+$/.test(value.trim());
}
