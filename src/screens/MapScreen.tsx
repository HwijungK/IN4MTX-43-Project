import { Pressable, Text, TextInput, View } from "react-native";

import { SecondaryButton, SmallButton } from "../components/Button";
import { Notice } from "../components/Notice";
import { TagRow } from "../components/Tags";
import { styles } from "../styles";
import type { Interest, NearbyGroup, NearbyUser } from "../types";
import { shortUniversity } from "../utils/format";

type MapScreenProps = {
  visibleUsers: NearbyUser[];
  nearbyGroups: NearbyGroup[];
  university: string;
  selectedTags: string[];
  filteredTags: Interest[];
  tagQuery: string;
  notice: string;
  onTagQuery: (value: string) => void;
  onAddTag: (tag: string) => Promise<void>;
  onCreateTag: () => Promise<void>;
  onBlock: (id: string) => void;
};

export function MapScreen({
  visibleUsers,
  nearbyGroups,
  university,
  selectedTags,
  filteredTags,
  tagQuery,
  notice,
  onTagQuery,
  onAddTag,
  onCreateTag,
  onBlock
}: MapScreenProps) {
  return (
    <>
      <View style={styles.mapCanvas}>
        <View style={[styles.mapDot, styles.mapDotA]} />
        <View style={[styles.mapDot, styles.mapDotB]} />
        <View style={[styles.mapDot, styles.mapDotC]} />
        <View style={[styles.groupFuzzy, styles.groupFuzzyA]} />
        <View style={[styles.groupFuzzy, styles.groupFuzzyB]} />
        <View style={styles.mapCenter}>
          <Text style={styles.mapCenterText}>You</Text>
        </View>
      </View>
      <Notice text={notice} />
      <View style={styles.badge}>
        <Text style={styles.badgeText}>Verified {shortUniversity(university)} campus view</Text>
      </View>
      <Text style={styles.sectionTitle}>Campus friends nearby</Text>
      {visibleUsers.map((user) => (
        <View key={user.id} style={styles.listCard}>
          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.cardTitle}>{user.name}</Text>
              <Text style={styles.metaText}>
                Verified {shortUniversity(user.university)} | {user.campusZone} |{" "}
                {user.friendScore}% friend fit
              </Text>
            </View>
            <SmallButton label="Block" onPress={() => onBlock(user.id)} />
          </View>
          <Text style={styles.bodyText}>{user.status}</Text>
          <TagRow tags={user.interests} />
        </View>
      ))}
      <Text style={styles.sectionTitle}>Fuzzy groups nearby</Text>
      {nearbyGroups.map((group) => (
        <View key={group.id} style={styles.listCard}>
          <Text style={styles.cardTitle}>{group.name}</Text>
          <Text style={styles.metaText}>
            {group.campusZone} | {group.peopleHere} people | {group.interest}
          </Text>
          <Text style={styles.bodyText}>{group.note}</Text>
        </View>
      ))}
      <Text style={styles.sectionTitle}>Trending on campus</Text>
      <TextInput
        style={styles.input}
        value={tagQuery}
        onChangeText={onTagQuery}
        placeholder="Search interests"
        placeholderTextColor="#7C756A"
      />
      {filteredTags.map((tag) => (
        <Pressable key={tag.id} style={styles.tagResult} onPress={() => void onAddTag(tag.label)}>
          <Text style={styles.cardTitle}>{tag.label}</Text>
          <Text style={styles.metaText}>
            {tag.subscribers} subscribers | {tag.activeNearby} active on campus
          </Text>
        </Pressable>
      ))}
      {tagQuery.trim() && filteredTags.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.cardTitle}>No campus tags found yet.</Text>
          <SecondaryButton
            label={`Add #${tagQuery.trim().replace(/^#/, "")}`}
            onPress={() => void onCreateTag()}
          />
        </View>
      )}
      <Text style={styles.metaText}>Your tags: {selectedTags.join(", ")}</Text>
    </>
  );
}
