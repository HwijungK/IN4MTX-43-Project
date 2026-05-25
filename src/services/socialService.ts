import { supabase } from "../lib/supabase";
import { normalizeInterestLabel } from "../utils/interestUtils";

export async function addInterestToProfile(userId: string, label: string) {
  const normalized = normalizeInterestLabel(label);

  let { data: interest, error } = await supabase
    .from("interests")
    .select("id")
    .eq("name", normalized)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!interest) {
    const created = await supabase
      .from("interests")
      .insert({
        name: normalized,
        subscriber_count: 1,
        created_by: userId
      })
      .select("id")
      .single();

    if (created.error) {
      throw created.error;
    }
    interest = created.data;
  }

  const { error: userInterestError } = await supabase
    .from("user_interests")
    .upsert(
      {
        user_id: userId,
        interest_id: interest.id
      },
      { onConflict: "user_id,interest_id" }
    );

  if (userInterestError) {
    throw userInterestError;
  }

  return normalized;
}

export async function getProfileInterestLabels(userId: string) {
  const { data, error } = await supabase
    .from("user_interests")
    .select("interests(name)")
    .eq("user_id", userId);

  if (error) {
    throw error;
  }

  return (data ?? [])
    .map((row) => {
      const interest = row.interests as { name?: string } | null;
      return interest?.name;
    })
    .filter((name): name is string => Boolean(name));
}

export async function addAcceptedFriend(requesterId: string, addresseeId: string) {
  const { error } = await supabase
    .from("friendships")
    .upsert(
      {
        requester_id: requesterId,
        addressee_id: addresseeId,
        status: "accepted"
      },
      { onConflict: "requester_id,addressee_id" }
    );

  if (error) {
    throw error;
  }
}

export async function joinPublicCommunity(userId: string, communityId: string) {
  const { error } = await supabase
    .from("community_members")
    .upsert(
      {
        community_id: communityId,
        user_id: userId,
        role: "member"
      },
      { onConflict: "community_id,user_id" }
    );

  if (error) {
    throw error;
  }
}

export async function requestCommunityJoin(userId: string, communityId: string) {
  const { error } = await supabase
    .from("community_join_requests")
    .upsert(
      {
        community_id: communityId,
        user_id: userId,
        status: "pending"
      },
      { onConflict: "community_id,user_id" }
    );

  if (error) {
    throw error;
  }
}
