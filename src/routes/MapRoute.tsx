import { ScrollableScreen } from "../components/Screen";
import { MapScreen } from "../screens/MapScreen";
import { useAppContext } from "../state/AppContext";

export function MapRoute() {
  const app = useAppContext();

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
        onBlock={app.blockUser}
      />
    </ScrollableScreen>
  );
}
