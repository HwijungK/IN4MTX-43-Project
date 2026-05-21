import { Text, View } from "react-native";

import { SmallButton } from "../components/Button";
import { styles } from "../styles";
import type { Community } from "../types";

type CommunitiesScreenProps = {
  communities: Community[];
  joinedCommunities: string[];
  onJoin: (community: Community) => void;
};

export function CommunitiesScreen({
  communities,
  joinedCommunities,
  onJoin
}: CommunitiesScreenProps) {
  return (
    <>
      {communities.map((community) => {
        const joined = joinedCommunities.includes(community.id);
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
                label={joined ? "Joined" : community.privacy === "Request" ? "Request" : "Join"}
                onPress={() => onJoin(community)}
              />
            </View>
            <Text style={styles.bodyText}>{community.announcement}</Text>
            <Text style={styles.warningText}>Next event: {community.event}</Text>
          </View>
        );
      })}
      <View style={styles.panel}>
        <Text style={styles.cardTitle}>Lead tools draft</Text>
        <Text style={styles.bodyText}>Create meeting, post announcement, review join requests.</Text>
      </View>
    </>
  );
}
