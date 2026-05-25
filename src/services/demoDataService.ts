import { supabase } from "../lib/supabase";
import type { Chat, ChatMessage, Community, Interest, NearbyGroup, NearbyUser } from "../types";

type DemoInterestRow = {
  id: string;
  label: string;
  subscribers: number;
  active_nearby: number;
};

type DemoNearbyUserRow = {
  id: string;
  profile_id?: string;
  name: string;
  age: number;
  distance: string;
  identity: string;
  university: string;
  campus_zone: string;
  interests: string[] | null;
  status: string;
  friend_score: number;
};

type DemoNearbyGroupRow = {
  id: string;
  name: string;
  campus_zone: string;
  interest: string;
  people_here: number;
  note: string;
};

type DemoChatRow = {
  id: string;
  title: string;
  kind: Chat["kind"];
  preview: string;
  participants: number;
  expires: string | null;
};

type DemoChatMessageRow = {
  id: string;
  chat_id: string;
  sender: string;
  content: string;
  time: string;
  is_mine: boolean;
};

type DemoCommunityRow = {
  id: string;
  community_id?: string;
  name: string;
  tag: string;
  distance: string;
  members: number;
  privacy: Community["privacy"];
  announcement: string;
  event: string;
};

type DemoFriendRow = {
  user_id: string;
};

type DemoSelectedTagRow = {
  label: string;
};

type DemoJoinedCommunityRow = {
  community_id: string;
};

export async function getDemoInterests(): Promise<Interest[]> {
  const { data, error } = await supabase
    .from("demo_interest_rows")
    .select("*")
    .order("subscribers", { ascending: false });

  if (error) {
    throw error;
  }

  return ((data ?? []) as DemoInterestRow[]).map((row) => ({
    id: row.id,
    label: row.label,
    subscribers: row.subscribers,
    activeNearby: row.active_nearby
  }));
}

export async function getDemoNearbyUsers(): Promise<NearbyUser[]> {
  const { data, error } = await supabase
    .from("demo_nearby_user_rows")
    .select("*")
    .order("friend_score", { ascending: false });

  if (error) {
    throw error;
  }

  return ((data ?? []) as DemoNearbyUserRow[]).map((row) => ({
    id: row.id,
    profileId: row.profile_id,
    name: row.name,
    age: row.age,
    distance: row.distance,
    identity: row.identity,
    university: row.university,
    campusZone: row.campus_zone,
    interests: row.interests ?? [],
    status: row.status,
    friendScore: row.friend_score
  }));
}

export async function getDemoNearbyGroups(): Promise<NearbyGroup[]> {
  const { data, error } = await supabase
    .from("demo_nearby_group_rows")
    .select("*")
    .order("people_here", { ascending: false });

  if (error) {
    throw error;
  }

  return ((data ?? []) as DemoNearbyGroupRow[]).map((row) => ({
    id: row.id,
    name: row.name,
    campusZone: row.campus_zone,
    interest: row.interest,
    peopleHere: row.people_here,
    note: row.note
  }));
}

export async function getDemoChats(): Promise<Chat[]> {
  const { data, error } = await supabase.from("demo_chat_rows").select("*");

  if (error) {
    throw error;
  }

  return ((data ?? []) as DemoChatRow[]).map((row) => ({
    id: row.id,
    title: row.title,
    kind: row.kind,
    preview: row.preview,
    participants: row.participants,
    expires: row.expires ?? undefined
  }));
}

export async function getDemoChatMessages(): Promise<ChatMessage[]> {
  const { data, error } = await supabase.from("demo_chat_message_rows").select("*");

  if (error) {
    throw error;
  }

  return ((data ?? []) as DemoChatMessageRow[]).map((row) => ({
    id: row.id,
    chatId: row.chat_id,
    sender: row.sender,
    content: row.content,
    time: row.time,
    isMine: row.is_mine
  }));
}

export async function getDemoCommunities(): Promise<Community[]> {
  const { data, error } = await supabase
    .from("demo_community_rows")
    .select("*")
    .order("members", { ascending: false });

  if (error) {
    throw error;
  }

  return ((data ?? []) as DemoCommunityRow[]).map((row) => ({
    id: row.id,
    communityId: row.community_id,
    name: row.name,
    tag: row.tag,
    distance: row.distance,
    members: row.members,
    privacy: row.privacy,
    announcement: row.announcement,
    event: row.event
  }));
}

export async function getDemoFriendIds() {
  const { data, error } = await supabase.from("demo_friend_rows").select("*");

  if (error) {
    throw error;
  }

  return ((data ?? []) as DemoFriendRow[]).map((row) => row.user_id);
}

export async function getDemoSelectedTags() {
  const { data, error } = await supabase.from("demo_selected_tag_rows").select("*");

  if (error) {
    throw error;
  }

  return ((data ?? []) as DemoSelectedTagRow[]).map((row) => row.label);
}

export async function getDemoJoinedCommunityIds() {
  const { data, error } = await supabase.from("demo_joined_community_rows").select("*");

  if (error) {
    throw error;
  }

  return ((data ?? []) as DemoJoinedCommunityRow[]).map((row) => row.community_id);
}
