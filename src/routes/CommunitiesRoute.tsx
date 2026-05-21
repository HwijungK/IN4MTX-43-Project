import { ScrollableScreen } from "../components/Screen";
import { CommunitiesScreen } from "../screens/CommunitiesScreen";
import { useAppContext } from "../state/AppContext";

export function CommunitiesRoute() {
  const app = useAppContext();

  return (
    <ScrollableScreen>
      <CommunitiesScreen
        communities={app.communities}
        joinedCommunities={app.joinedCommunities}
        onJoin={app.joinCommunity}
      />
    </ScrollableScreen>
  );
}
