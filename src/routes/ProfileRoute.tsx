import { ScrollableScreen } from "../components/Screen";
import { ProfileScreen } from "../screens/ProfileScreen";
import { useAppContext } from "../state/AppContext";

export function ProfileRoute() {
  const app = useAppContext();

  return (
    <ScrollableScreen>
      <ProfileScreen
        displayName={app.displayName}
        bio={app.bio}
        identity={app.identity}
        university={app.university}
        universityChoices={app.universityChoices}
        age={app.age}
        selectedTags={app.selectedTags}
        notice={app.notice}
        authError={app.authError}
        authLoading={app.authLoading}
        onDisplayName={app.setDisplayName}
        onBio={app.setBio}
        onIdentity={app.setIdentity}
        onUniversity={app.setUniversity}
        onAge={app.setAge}
        onRemoveTag={app.removeTag}
        onSaveProfile={() => {
          void app.saveProfile();
        }}
        onSignOut={() => {
          void app.signOut();
        }}
      />
    </ScrollableScreen>
  );
}
