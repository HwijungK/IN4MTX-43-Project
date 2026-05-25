import type { Community, NearbyUser } from "../types";
import { normalizeInterestLabel } from "./interestUtils";

export function buildInterestMembership(userId: string, label: string, existingInterestId?: string) {
  const normalized = normalizeInterestLabel(label);
  if (normalized === "#") {
    throw new Error("Interest tags need at least one letter or number.");
  }

  return {
    normalized,
    interestInsert: existingInterestId
      ? null
      : {
          name: normalized,
          subscriber_count: 1,
          created_by: userId
        },
    userInterestInsert: existingInterestId
      ? {
          user_id: userId,
          interest_id: existingInterestId
        }
      : null
  };
}

export function buildAcceptedFriendship(requesterId: string, user: NearbyUser) {
  if (!user.profileId) {
    throw new Error("Cannot add a friend without a profile id.");
  }

  return {
    requester_id: requesterId,
    addressee_id: user.profileId,
    status: "accepted" as const
  };
}

export function buildCommunityJoinWrite(userId: string, community: Community) {
  if (!community.communityId) {
    throw new Error("Cannot join a community without a community id.");
  }

  if (community.privacy === "Request") {
    return {
      table: "community_join_requests" as const,
      row: {
        community_id: community.communityId,
        user_id: userId,
        status: "pending" as const
      }
    };
  }

  return {
    table: "community_members" as const,
    row: {
      community_id: community.communityId,
      user_id: userId,
      role: "member" as const
    }
  };
}
