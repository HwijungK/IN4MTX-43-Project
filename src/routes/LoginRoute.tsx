import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { LoginScreen } from "../screens/LoginScreen";
import type { RootStackParamList } from "../navigation/types";
import { useAppContext } from "../state/AppContext";

type LoginRouteProps = NativeStackScreenProps<RootStackParamList, "Login">;

export function LoginRoute({ navigation }: LoginRouteProps) {
  const app = useAppContext();

  async function handleLogin(email: string, password: string) {
    await app.signIn(email, password);
  }

  return (
    <LoginScreen
      authError={app.authError}
      authLoading={app.authLoading}
      onLogin={(email, password) => {
        void handleLogin(email, password);
      }}
      onCreateAccount={() => {
        navigation.navigate("Setup");
      }}
      onDevBypass={app.enterDevBypass}
    />
  );
}
