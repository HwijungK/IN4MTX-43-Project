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
  onAddFriend: (user: NearbyUser) => Promise<void>;
  onStartChat: (user: NearbyUser) => void;
  onViewProfile: (user: NearbyUser) => void;
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
  onAddFriend,
  onStartChat,
  onViewProfile,
  onBlock
}: MapScreenProps) {
  const mapUsers = visibleUsers.slice(0, 3);

  return (
    <>
      <View style={styles.mapCanvas}>
        {mapUsers[0] ? (
          <View style={[styles.mapDot, styles.mapDotA]}>
            <Text style={styles.mapDotText}>{mapUsers[0].name}</Text>
          </View>
        ) : null}
        {mapUsers[1] ? (
          <View style={[styles.mapDot, styles.mapDotB]}>
            <Text style={styles.mapDotText}>{mapUsers[1].name}</Text>
          </View>
        ) : null}
        {mapUsers[2] ? (
          <View style={[styles.mapDot, styles.mapDotC]}>
            <Text style={styles.mapDotText}>{mapUsers[2].name}</Text>
          </View>
        ) : null}
        <View style={[styles.groupFuzzy, styles.groupFuzzyA]}>
          <Text style={styles.groupFuzzyText}>Informal group</Text>
        </View>
        <View style={[styles.groupFuzzy, styles.groupFuzzyB]}>
          <Text style={styles.groupFuzzyText}>#Casual meetup</Text>
        </View>
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
          </View>
          <Text style={styles.bodyText}>{user.status}</Text>
          <TagRow tags={user.interests} />
          <View style={styles.mapActions}>
            <SmallButton label="Profile" onPress={() => onViewProfile(user)} />
            <SmallButton label="Chat" onPress={() => onStartChat(user)} />
            <SmallButton label="Add" onPress={() => void onAddFriend(user)} />
            <SmallButton label="Block" onPress={() => onBlock(user.id)} />
          </View>
        </View>
      ))}
      <Text style={styles.sectionTitle}>Groups nearby</Text>
      {nearbyGroups.map((group) => (
        <View key={group.id} style={styles.listCard}>
          <Text style={styles.cardTitle}>{group.name}</Text>
          <Text style={styles.metaText}>
            {group.campusZone} | {group.peopleHere} people | {group.interest} | #Casual
          </Text>
          <Text style={styles.bodyText}>{group.note}</Text>
        </View>
      ))}
      <Text style={styles.sectionTitle}>Search interests</Text>
      <TextInput
        style={styles.input}
        value={tagQuery}
        onChangeText={onTagQuery}
        placeholder="Search interests"
        placeholderTextColor="#7C756A"
      />
      <Text style={styles.sectionTitle}>Trending on campus</Text>
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
