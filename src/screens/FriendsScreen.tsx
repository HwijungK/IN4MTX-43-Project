import { useMemo, useState } from "react";
import { Text, TextInput, View } from "react-native";

import { SecondaryButton, SmallButton } from "../components/Button";
import { Notice } from "../components/Notice";
import { TagRow } from "../components/Tags";
import { styles } from "../styles";
import type { NearbyUser } from "../types";
import { shortUniversity } from "../utils/format";

type FriendsScreenProps = {
  friends: NearbyUser[];
  suggestedFriends: NearbyUser[];
  notice: string;
  onAddFriend: (user: NearbyUser) => void;
};

export function FriendsScreen({
  friends,
  suggestedFriends,
  notice,
  onAddFriend
}: FriendsScreenProps) {
  const [query, setQuery] = useState("");
  const [showAllFriends, setShowAllFriends] = useState(false);

  const normalizedQuery = query.trim().toLowerCase();
  const filteredFriends = useMemo(
    () => filterUsers(friends, normalizedQuery),
    [friends, normalizedQuery]
  );
  const filteredSuggestions = useMemo(
    () => filterUsers(suggestedFriends, normalizedQuery),
    [suggestedFriends, normalizedQuery]
  );

  const displayedFriends = showAllFriends ? filteredFriends : filteredFriends.slice(0, 3);
  const hiddenFriendCount = Math.max(filteredFriends.length - displayedFriends.length, 0);

  return (
    <>
      <TextInput
        style={styles.input}
        value={query}
        onChangeText={setQuery}
        placeholder="Search people"
        placeholderTextColor="#7C756A"
      />
      <Notice text={notice} />

      <View style={styles.rowBetween}>
        <Text style={styles.sectionTitle}>Friends</Text>
        {filteredFriends.length > 3 ? (
          <SecondaryButton
            label={showAllFriends ? "Show less" : `Show more (${hiddenFriendCount})`}
            onPress={() => setShowAllFriends((current) => !current)}
          />
        ) : null}
      </View>
      {displayedFriends.length ? (
        displayedFriends.map((friend) => <PersonCard key={friend.id} user={friend} status="Friend" />)
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.cardTitle}>No friends found.</Text>
          <Text style={styles.bodyText}>Try another search or add someone from suggested friends.</Text>
        </View>
      )}

      <Text style={styles.sectionTitle}>Suggested friends</Text>
      {filteredSuggestions.length ? (
        filteredSuggestions.map((user) => (
          <PersonCard key={user.id} user={user} actionLabel="Add" onAction={() => onAddFriend(user)} />
        ))
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.cardTitle}>No suggested friends found.</Text>
          <Text style={styles.bodyText}>Try searching by name, campus zone, university, or interest.</Text>
        </View>
      )}
    </>
  );
}

function PersonCard({
  user,
  status,
  actionLabel,
  onAction
}: {
  user: NearbyUser;
  status?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.listCard}>
      <View style={styles.rowBetween}>
        <View style={styles.flexOne}>
          <Text style={styles.cardTitle}>{user.name}</Text>
          <Text style={styles.metaText}>
            Verified {shortUniversity(user.university)} | {user.campusZone} | {user.friendScore}% friend fit
          </Text>
        </View>
        {onAction && actionLabel ? (
          <SmallButton label={actionLabel} onPress={onAction} />
        ) : (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{status}</Text>
          </View>
        )}
      </View>
      <Text style={styles.bodyText}>{user.status}</Text>
      <TagRow tags={user.interests} />
    </View>
  );
}

function filterUsers(users: NearbyUser[], query: string) {
  if (!query) {
    return users;
  }

  return users.filter((user) => {
    const searchable = [
      user.name,
      user.university,
      user.campusZone,
      user.status,
      ...user.interests
    ]
      .join(" ")
      .toLowerCase();
    return searchable.includes(query);
  });
}
