import { useNavigation } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { ScrollableScreen } from "../components/Screen";
import { MapScreen } from "../screens/MapScreen";
import { useAppContext } from "../state/AppContext";
import type { MainTabParamList, RootStackParamList } from "../navigation/types";

export function MapRoute() {
  const app = useAppContext();
  const navigation = useNavigation<BottomTabNavigationProp<MainTabParamList, "Map">>();
  const rootNavigation = navigation.getParent<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <ScrollableScreen>
      <MapScreen
        visibleUsers={app.visibleUsers}
        nearbyGroups={app.nearbyGroups}
        university={app.university}
        selectedTags={app.selectedTags}
        filteredTags={app.filteredTags}
        tagQuery={app.tagQuery}
        notice={app.notice}
        onTagQuery={app.setTagQuery}
        onAddTag={app.addTag}
        onCreateTag={app.createTagFromQuery}
        onAddFriend={app.addFriend}
        onStartChat={(user) => {
          app.openChatWithUser(user);
          navigation.navigate("Chats");
        }}
        onViewProfile={(user) => rootNavigation?.navigate("UserProfile", { userId: user.id })}
        onBlock={app.blockUser}
      />
    </ScrollableScreen>
  );
}
