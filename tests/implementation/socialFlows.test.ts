import assert from "node:assert/strict";
import test from "node:test";

import {
  buildAcceptedFriendship,
  buildCommunityJoinWrite,
  buildInterestMembership
} from "../../src/utils/socialLogic";

test("implementation: new typed interest produces interest insert data", () => {
  const write = buildInterestMembership("user-1", "Board Games!");

  assert.deepEqual(write.interestInsert, {
    name: "#board_games",
    subscriber_count: 1,
    created_by: "user-1"
  });
  assert.equal(write.userInterestInsert, null);
});

test("implementation: existing interest produces user_interests insert data", () => {
  const write = buildInterestMembership("user-1", "#coffee", "interest-1");

  assert.equal(write.interestInsert, null);
  assert.deepEqual(write.userInterestInsert, {
    user_id: "user-1",
    interest_id: "interest-1"
  });
});

test("implementation: suggested friend add maps UI user to accepted friendship row", () => {
  const row = buildAcceptedFriendship("user-1", {
    id: "maya",
    profileId: "user-2",
    name: "Maya",
    age: 21,
    distance: "0.2 mi",
    identity: "University student",
    university: "UC Irvine",
    campusZone: "Aldrich Park",
    interests: ["#coffee"],
    status: "Looking for a cafe study break",
    friendScore: 92
  });

  assert.deepEqual(row, {
    requester_id: "user-1",
    addressee_id: "user-2",
    status: "accepted"
  });
});

test("implementation: public community join writes to community_members", () => {
  const write = buildCommunityJoinWrite("user-1", {
    id: "third-place",
    communityId: "community-1",
    name: "Third Place Coffee",
    tag: "#coffee",
    distance: "0.5 mi",
    members: 154,
    privacy: "Public",
    announcement: "Study table thread.",
    event: "Today 2:00 PM"
  });

  assert.deepEqual(write, {
    table: "community_members",
    row: {
      community_id: "community-1",
      user_id: "user-1",
      role: "member"
    }
  });
});

test("implementation: request-only community join writes pending request", () => {
  const write = buildCommunityJoinWrite("user-1", {
    id: "beginner-climbers",
    communityId: "community-2",
    name: "Beginner Climbers",
    tag: "#climbing",
    distance: "1.1 mi",
    members: 87,
    privacy: "Request",
    announcement: "Belay basics.",
    event: "Saturday 10:00 AM"
  });

  assert.deepEqual(write, {
    table: "community_join_requests",
    row: {
      community_id: "community-2",
      user_id: "user-1",
      status: "pending"
    }
  });
});
