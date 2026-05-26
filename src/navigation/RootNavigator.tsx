import { Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { LoginRoute } from "../routes/LoginRoute";
import { SetupRoute } from "../routes/SetupRoute";
import { UserProfileRoute } from "../routes/UserProfileRoute";
import { styles } from "../styles";
import { useAppContext } from "../state/AppContext";
import { MainTabs } from "./MainTabs";
import type { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const app = useAppContext();

  if (!app.sessionReady) {
    return (
      <View style={styles.loadingScreen}>
        <Text style={styles.cardTitle}>Loading CommonGround...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {app.devBypassAuth ? (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen name="UserProfile" component={UserProfileRoute} />
          </>
        ) : !app.session ? (
          <>
            <Stack.Screen name="Login" component={LoginRoute} />
            <Stack.Screen name="Setup" component={SetupRoute} />
          </>
        ) : !app.profile ? (
          <Stack.Screen name="Setup" component={SetupRoute} />
        ) : (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen name="UserProfile" component={UserProfileRoute} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
