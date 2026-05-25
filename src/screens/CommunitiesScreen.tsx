import { Text, TextInput, View } from "react-native";

import { SmallButton } from "../components/Button";
import { styles } from "../styles";
import type { Community } from "../types";

type CommunitiesScreenProps = {
  communities: Community[];
  joinedCommunities: string[];
  communityQuery: string;
  onCommunityQuery: (value: string) => void;
  onJoin: (community: Community) => Promise<void>;
};

export function CommunitiesScreen({
  communities,
  joinedCommunities,
  communityQuery,
  onCommunityQuery,
  onJoin
}: CommunitiesScreenProps) {
  const query = communityQuery.trim().toLowerCase();
  const matchingCommunities = query
    ? communities.filter(
        (community) =>
          community.name.toLowerCase().includes(query) ||
          community.tag.toLowerCase().includes(query) ||
          community.announcement.toLowerCase().includes(query)
      )
    : communities;
  const joined = matchingCommunities.filter((community) => joinedCommunities.includes(community.id));
  const suggested = matchingCommunities.filter((community) => !joinedCommunities.includes(community.id));

  function renderCommunity(community: Community) {
    const isJoined = joinedCommunities.includes(community.id);
    return (
      <View key={community.id} style={styles.listCard}>
        <View style={styles.rowBetween}>
          <View style={styles.flexOne}>
            <Text style={styles.cardTitle}>{community.name}</Text>
            <Text style={styles.metaText}>
              Informal group | {community.tag} | {community.distance} | {community.members} members
            </Text>
          </View>
          <SmallButton
            label={isJoined ? "Joined" : community.privacy === "Request" ? "Request" : "Join"}
            onPress={() => void onJoin(community)}
          />
        </View>
        <Text style={styles.bodyText}>{community.announcement}</Text>
        <Text style={styles.warningText}>Next event: {community.event}</Text>
      </View>
    );
  }

  return (
    <>
      <TextInput
        style={styles.input}
        value={communityQuery}
        onChangeText={onCommunityQuery}
        placeholder="Search communities"
        placeholderTextColor="#7C756A"
      />
      <Text style={styles.sectionTitle}>Joined communities</Text>
      {joined.length ? joined.map(renderCommunity) : (
        <View style={styles.emptyState}>
          <Text style={styles.bodyText}>No joined communities match this search.</Text>
        </View>
      )}
      <Text style={styles.sectionTitle}>Suggested communities</Text>
      {suggested.length ? suggested.map(renderCommunity) : (
        <View style={styles.emptyState}>
          <Text style={styles.bodyText}>No suggested communities match this search.</Text>
        </View>
      )}
      <View style={styles.panel}>
        <Text style={styles.cardTitle}>Lead tools draft</Text>
        <Text style={styles.bodyText}>Create meeting, post announcement, review join requests.</Text>
      </View>
    </>
  );
}
