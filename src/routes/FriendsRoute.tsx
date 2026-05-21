import { ScrollableScreen } from "../components/Screen";
import { FriendsScreen } from "../screens/FriendsScreen";
import { useAppContext } from "../state/AppContext";

export function FriendsRoute() {
  const app = useAppContext();

  return (
    <ScrollableScreen>
      <FriendsScreen
        friends={app.friends}
        suggestedFriends={app.suggestedFriends}
        notice={app.notice}
        onAddFriend={app.addFriend}
      />
    </ScrollableScreen>
  );
}
