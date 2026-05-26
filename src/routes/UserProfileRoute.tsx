import { Text } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RouteProp } from "@react-navigation/native";

import { ScrollableScreen } from "../components/Screen";
import { ReadOnlyProfileScreen } from "../screens/ReadOnlyProfileScreen";
import { styles } from "../styles";
import { useAppContext } from "../state/AppContext";
import type { RootStackParamList } from "../navigation/types";

export function UserProfileRoute() {
  const app = useAppContext();
  const route = useRoute<RouteProp<RootStackParamList, "UserProfile">>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const user = app.visibleUsers.find((candidate) => candidate.id === route.params.userId);

  return (
    <ScrollableScreen>
      {user ? (
        <ReadOnlyProfileScreen user={user} onBack={() => navigation.goBack()} />
      ) : (
        <Text style={styles.errorText}>This profile is no longer available on the map.</Text>
      )}
    </ScrollableScreen>
  );
}
