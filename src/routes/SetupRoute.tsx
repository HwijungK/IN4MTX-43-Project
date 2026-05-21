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
      ageRange={app.ageRange}
      selectedTags={app.selectedTags}
      authError={app.authError}
      authLoading={app.authLoading}
      onDisplayName={app.setDisplayName}
      onIdentity={app.setIdentity}
      onUniversity={app.setUniversity}
      onAgeRange={app.setAgeRange}
      onSelectedTags={app.setSelectedTags}
      onEnterApp={() => {
        void app.signUpAndCreateProfile();
      }}
      onBackToLogin={() => navigation.goBack()}
    />
  );
}
