import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import type { RootStackParamList } from "../navigation/types";
import { SetupScreen } from "../screens/SetupScreen";
import { useAppContext } from "../state/AppContext";

type SetupRouteProps = NativeStackScreenProps<RootStackParamList, "Setup">;

export function SetupRoute({ navigation }: SetupRouteProps) {
  const app = useAppContext();

  return (
    <SetupScreen
      displayName={app.displayName}
      identity={app.identity}
      university={app.university}
      universityChoices={app.universityChoices}
      age={app.age}
      interestChoices={app.interestChoices}
      selectedTags={app.selectedTags}
      authError={app.authError}
      authLoading={app.authLoading}
      signupEmail={app.pendingSignupEmail}
      signupPassword={app.pendingSignupPassword}
      onDisplayName={app.setDisplayName}
      onIdentity={app.setIdentity}
      onUniversity={app.setUniversity}
      onAge={app.setAge}
      onSignupEmail={app.setPendingSignupEmail}
      onSignupPassword={app.setPendingSignupPassword}
      onSelectedTags={app.setSelectedTags}
      onEnterApp={() => {
        void app.signUpAndCreateProfile();
      }}
      onBackToLogin={() => {
        void app.signOut();
        if (navigation.canGoBack()) {
          navigation.goBack();
        }
      }}
    />
  );
}
