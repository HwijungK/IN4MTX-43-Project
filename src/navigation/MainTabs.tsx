import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { ChatsRoute } from "../routes/ChatsRoute";
import { CommunitiesRoute } from "../routes/CommunitiesRoute";
import { FriendsRoute } from "../routes/FriendsRoute";
import { MapRoute } from "../routes/MapRoute";
import { ProfileRoute } from "../routes/ProfileRoute";
import type { MainTabParamList } from "./types";

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: "#24575A",
        tabBarInactiveTintColor: "#7C756A",
        tabBarStyle: {
          borderTopColor: "#E1D8C8"
        }
      }}
    >
      <Tab.Screen name="Map" component={MapRoute} />
      <Tab.Screen name="Friends" component={FriendsRoute} />
      <Tab.Screen name="Chats" component={ChatsRoute} />
      <Tab.Screen name="Communities" component={CommunitiesRoute} />
      <Tab.Screen name="Profile" component={ProfileRoute} />
    </Tab.Navigator>
  );
}
