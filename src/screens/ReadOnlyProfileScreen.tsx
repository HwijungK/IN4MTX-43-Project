import { Text, View } from "react-native";

import { SecondaryButton } from "../components/Button";
import { TagRow } from "../components/Tags";
import { styles } from "../styles";
import type { NearbyUser } from "../types";
import { shortUniversity } from "../utils/format";

type ReadOnlyProfileScreenProps = {
  user: NearbyUser;
  onBack: () => void;
};

export function ReadOnlyProfileScreen({ user, onBack }: ReadOnlyProfileScreenProps) {
  return (
    <>
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user.name.slice(0, 1).toUpperCase()}</Text>
        </View>
        <View style={styles.flexOne}>
          <Text style={styles.heroTitle}>{user.name}</Text>
          <Text style={styles.metaText}>
            {user.identity} | Verified {shortUniversity(user.university)} | Age {user.age}
          </Text>
        </View>
      </View>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>Verified {shortUniversity(user.university)}</Text>
      </View>
      <View style={styles.panel}>
        <Text style={styles.label}>Bio</Text>
        <Text style={styles.bodyText}>{user.status}</Text>
      </View>
      <View style={styles.panel}>
        <Text style={styles.label}>Campus area</Text>
        <Text style={styles.bodyText}>
          {user.campusZone} | {user.distance} away | {user.friendScore}% friend fit
        </Text>
      </View>
      <Text style={styles.sectionTitle}>Profile interests</Text>
      <TagRow tags={user.interests} />
      <View style={styles.mediaGrid}>
        <View style={styles.mediaTile}>
          <Text style={styles.mediaText}>Photo</Text>
        </View>
        <View style={styles.mediaTile}>
          <Text style={styles.mediaText}>Video</Text>
        </View>
        <View style={styles.mediaTile}>
          <Text style={styles.mediaText}>Campus</Text>
        </View>
      </View>
      <SecondaryButton label="Back to map" onPress={onBack} />
    </>
  );
}
