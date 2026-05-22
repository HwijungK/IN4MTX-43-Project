import { useState } from "react";
import { Text, TextInput, View } from "react-native";

import { PrimaryButton, SecondaryButton } from "../components/Button";
import { Screen } from "../components/Screen";
import { styles } from "../styles";

type LoginScreenProps = {
  authError: string;
  authLoading: boolean;
  onLogin: (email: string, password: string) => void;
  onCreateAccount: (email: string, password: string) => void;
  onDevBypass: () => void;
};

export function LoginScreen({
  authError,
  authLoading,
  onLogin,
  onCreateAccount,
  onDevBypass
}: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const disableActions = authLoading || !email.trim() || !password;

  return (
    <Screen>
      <View style={styles.authPanel}>
        <Text style={styles.kicker}>CommonGround</Text>
        <Text style={styles.heroTitle}>Make campus friends through shared interests.</Text>
        <Text style={styles.bodyText}>
          First draft prototype with local mock data. School login is simulated so we can focus on
          the campus friendship flow.
        </Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="University email"
          placeholderTextColor="#7C756A"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          placeholderTextColor="#7C756A"
          secureTextEntry
        />
        {authError ? <Text style={styles.errorText}>{authError}</Text> : null}
        <PrimaryButton
          label={authLoading ? "Working..." : "Log in"}
          onPress={() => onLogin(email, password)}
          disabled={disableActions}
        />
        <SecondaryButton
          label="Create account"
          onPress={() => onCreateAccount(email, password)}
          disabled={disableActions}
        />
        <SecondaryButton label="Continue in test mode" onPress={onDevBypass} disabled={authLoading} />
      </View>
    </Screen>
  );
}
