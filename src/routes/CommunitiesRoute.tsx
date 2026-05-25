import { useState } from "react";

import { ScrollableScreen } from "../components/Screen";
import { CommunitiesScreen } from "../screens/CommunitiesScreen";
import { useAppContext } from "../state/AppContext";

export function CommunitiesRoute() {
  const app = useAppContext();
  const [communityQuery, setCommunityQuery] = useState("");

  return (
    <ScrollableScreen>
      <CommunitiesScreen
        communities={app.communities}
        joinedCommunities={app.joinedCommunities}
        communityQuery={communityQuery}
        onCommunityQuery={setCommunityQuery}
        onJoin={app.joinCommunity}
      />
    </ScrollableScreen>
  );
}
