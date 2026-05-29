import assert from "node:assert/strict";
import test from "node:test";

import {
  buildAcceptedFriendship,
  buildCommunityJoinWrite,
  buildInterestMembership
} from "../../src/utils/socialLogic";
import { supabase } from "../../src/lib/supabase";
import {
  addAcceptedFriend,
  addInterestToProfile,
  getProfileInterestLabels,
  joinPublicCommunity,
  requestCommunityJoin
} from "../../src/services/socialService";
import {
  getDemoChatMessages,
  getDemoChats,
  getDemoCommunities,
  getDemoInterests,
  getDemoJoinedCommunityIds,
  getDemoNearbyGroups,
  getDemoNearbyUsers,
  getDemoSelectedTags
} from "../../src/services/demoDataService";
import {
  getProfile,
  getUniversities,
  getUniversityById,
  getUniversityByName,
  profileToAppFields,
  upsertProfile
} from "../../src/services/profileService";
import {
  getCurrentSession,
  onAuthSessionChange,
  signInWithEmail,
  signOut,
  signUpWithEmail
} from "../../src/services/authService";

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

test("implementation: social logic rejects unsafe writes before database calls", () => {
  assert.throws(() => buildInterestMembership("user-1", "!!!"), /at least one/);
  assert.throws(
    () =>
      buildAcceptedFriendship("user-1", {
        id: "local",
        name: "Local only",
        age: 21,
        distance: "0.4 mi",
        identity: "University student",
        university: "UC Irvine",
        campusZone: "Library",
        interests: [],
        status: "No profile row",
        friendScore: 50
      }),
    /profile id/
  );
  assert.throws(
    () =>
      buildCommunityJoinWrite("user-1", {
        id: "local-community",
        name: "Local Community",
        tag: "#local",
        distance: "nearby",
        members: 1,
        privacy: "Public",
        announcement: "No backing row.",
        event: "Soon"
      }),
    /community id/
  );
});

test("implementation: addInterestToProfile reuses existing interest and upserts membership", async () => {
  const calls: unknown[] = [];
  mockSupabaseFrom((table) => {
    calls.push(table);
    if (table === "interests") {
      return query({ data: { id: "interest-1" }, error: null });
    }
    if (table === "user_interests") {
      return query({ error: null, onUpsert: (row, options) => calls.push({ row, options }) });
    }
    throw new Error(`Unexpected table ${table}`);
  });

  const label = await addInterestToProfile("user-1", " Coffee ");

  assert.equal(label, "#coffee");
  assert.deepEqual(calls, [
    "interests",
    "user_interests",
    {
      row: { user_id: "user-1", interest_id: "interest-1" },
      options: { onConflict: "user_id,interest_id" }
    }
  ]);
});

test("implementation: addInterestToProfile creates missing interest then links it", async () => {
  const writes: unknown[] = [];
  mockSupabaseFrom((table) => {
    if (table === "interests") {
      return query({
        data: null,
        error: null,
        singleData: { id: "interest-new" },
        onInsert: (row) => writes.push(row)
      });
    }
    if (table === "user_interests") {
      return query({ error: null, onUpsert: (row) => writes.push(row) });
    }
    throw new Error(`Unexpected table ${table}`);
  });

  await addInterestToProfile("user-1", "Board Games!");

  assert.deepEqual(writes, [
    { name: "#board_games", subscriber_count: 1, created_by: "user-1" },
    { user_id: "user-1", interest_id: "interest-new" }
  ]);
});

test("implementation: social service write helpers target the correct tables", async () => {
  const writes: unknown[] = [];
  mockSupabaseFrom((table) =>
    query({
      error: null,
      onUpsert: (row, options) => writes.push({ table, row, options })
    })
  );

  await addAcceptedFriend("user-1", "user-2");
  await joinPublicCommunity("user-1", "community-1");
  await requestCommunityJoin("user-1", "community-2");

  assert.deepEqual(writes, [
    {
      table: "friendships",
      row: { requester_id: "user-1", addressee_id: "user-2", status: "accepted" },
      options: { onConflict: "requester_id,addressee_id" }
    },
    {
      table: "community_members",
      row: { community_id: "community-1", user_id: "user-1", role: "member" },
      options: { onConflict: "community_id,user_id" }
    },
    {
      table: "community_join_requests",
      row: { community_id: "community-2", user_id: "user-1", status: "pending" },
      options: { onConflict: "community_id,user_id" }
    }
  ]);
});

test("implementation: getProfileInterestLabels drops broken join rows", async () => {
  mockSupabaseFrom(() =>
    query({
      data: [{ interests: { name: "#coffee" } }, { interests: null }, { interests: {} }],
      error: null
    })
  );

  assert.deepEqual(await getProfileInterestLabels("user-1"), ["#coffee"]);
});

test("implementation: demo data service maps database row names into app fields", async () => {
  mockSupabaseFrom((table) => {
    const rows: Record<string, unknown[]> = {
      demo_interest_rows: [{ id: "coffee", label: "#coffee", subscribers: 10, active_nearby: 3 }],
      demo_nearby_user_rows: [
        {
          id: "maya",
          profile_id: "user-2",
          name: "Maya",
          age: 21,
          distance: "0.2 mi",
          identity: "University student",
          university: "UC Irvine",
          campus_zone: "Aldrich Park",
          interests: null,
          status: "Coffee break",
          friend_score: 92
        }
      ],
      demo_nearby_group_rows: [
        { id: "study", name: "Study lawn", campus_zone: "Park", interest: "#coffee", people_here: 8, note: "Loose group" }
      ],
      demo_chat_rows: [{ id: "maya", title: "Maya", kind: "Friends", preview: "Hi", participants: 2, expires: null }],
      demo_chat_message_rows: [
        { id: "m1", chat_id: "maya", sender: "Maya", content: "Hi", time: "Now", is_mine: false }
      ],
      demo_community_rows: [
        {
          id: "coffee",
          community_id: "community-1",
          name: "Coffee",
          tag: "#coffee",
          distance: "0.5 mi",
          members: 10,
          privacy: "Public",
          announcement: "Meet",
          event: "Today"
        }
      ],
      demo_selected_tag_rows: [{ label: "#coffee" }],
      demo_joined_community_rows: [{ community_id: "coffee" }]
    };
    return query({ data: rows[table] ?? [], error: null });
  });

  assert.deepEqual(await getDemoInterests(), [{ id: "coffee", label: "#coffee", subscribers: 10, activeNearby: 3 }]);
  assert.deepEqual((await getDemoNearbyUsers())[0], {
    id: "maya",
    profileId: "user-2",
    name: "Maya",
    age: 21,
    distance: "0.2 mi",
    identity: "University student",
    university: "UC Irvine",
    campusZone: "Aldrich Park",
    interests: [],
    status: "Coffee break",
    friendScore: 92
  });
  assert.equal((await getDemoNearbyGroups())[0].peopleHere, 8);
  assert.equal((await getDemoChats())[0].expires, undefined);
  assert.equal((await getDemoChatMessages())[0].isMine, false);
  assert.equal((await getDemoCommunities())[0].communityId, "community-1");
  assert.deepEqual(await getDemoSelectedTags(), ["#coffee"]);
  assert.deepEqual(await getDemoJoinedCommunityIds(), ["coffee"]);
});

test("implementation: profile service maps profiles and falls back when age column is absent", async () => {
  const upserts: unknown[] = [];
  let profileWriteCount = 0;
  mockSupabaseFrom((table) => {
    if (table === "universities") {
      return query({ data: { id: "uci", name: "UC Irvine" }, error: null });
    }
    if (table === "profiles") {
      profileWriteCount += 1;
      return query({
        error: null,
        singleError:
          profileWriteCount === 1
            ? { code: "PGRST204", message: "Could not find the 'age' column of 'profiles'" }
            : undefined,
        singleData: profileWriteCount > 1 ? { id: "user-1", display_name: "Alex" } : undefined,
        onUpsert: (row) => upserts.push(row)
      });
    }
    throw new Error(`Unexpected table ${table}`);
  });

  const saved = await upsertProfile({
    id: "user-1",
    displayName: " Alex ",
    bio: " ",
    identity: "Adult",
    age: " 22 ",
    university: "UC Irvine"
  });

  assert.equal(saved.display_name, "Alex");
  assert.deepEqual(upserts, [
    {
      id: "user-1",
      display_name: "Alex",
      bio: null,
      identity_group: "adult",
      university_id: "uci",
      verified_university: true,
      age: 22
    },
    {
      id: "user-1",
      display_name: "Alex",
      bio: null,
      identity_group: "adult",
      university_id: "uci",
      verified_university: true,
      age_range: "22"
    }
  ]);
});

test("implementation: profile service reads profile and university rows", async () => {
  mockSupabaseFrom((table) => {
    if (table === "profiles") {
      return query({ data: { id: "user-1", display_name: "Alex" }, error: null });
    }
    if (table === "universities") {
      return query({ data: [{ id: "uci", name: "UC Irvine" }], error: null });
    }
    throw new Error(`Unexpected table ${table}`);
  });

  assert.equal((await getProfile("user-1"))?.display_name, "Alex");
  assert.equal((await getUniversities())[0].name, "UC Irvine");
  assert.equal((await getUniversityByName("UC Irvine"))?.[0].id, "uci");
  assert.equal((await getUniversityById("uci"))?.[0].name, "UC Irvine");
});

test("implementation: profileToAppFields handles identity labels and missing age", () => {
  const profile = {
    id: "user-1",
    display_name: "Sam",
    bio: null,
    identity_group: "child",
    age: null,
    age_range: "17",
    university_id: null,
    verified_university: false,
    avatar_url: null,
    created_at: "",
    updated_at: ""
  };

  assert.deepEqual(profileToAppFields(profile, { id: "ucla", name: "UCLA", short_name: "UCLA", email_domain: null, created_at: "" }), {
    displayName: "Sam",
    bio: "",
    identity: "Child",
    age: "17",
    university: "UCLA"
  });
});

test("implementation: auth service returns sessions and unsubscribes listeners", async () => {
  const calls: string[] = [];
  const previousAuth = supabase.auth;
  (supabase as { auth: unknown }).auth = {
    getSession: async () => ({ data: { session: { user: { id: "user-1" } } }, error: null }),
    signInWithPassword: async (credentials: unknown) => {
      calls.push(JSON.stringify(credentials));
      return { data: { session: "signed-in" }, error: null };
    },
    signUp: async (credentials: unknown) => {
      calls.push(JSON.stringify(credentials));
      return { data: { user: "created", session: null }, error: null };
    },
    signOut: async () => {
      calls.push("signOut");
      return { error: null };
    },
    onAuthStateChange: (callback: () => void) => {
      callback();
      return { data: { subscription: { unsubscribe: () => calls.push("unsubscribe") } } };
    }
  };

  try {
    let callbackCount = 0;
    assert.deepEqual(await getCurrentSession(), { user: { id: "user-1" } });
    assert.equal(await signInWithEmail("a@uci.edu", "secret"), "signed-in");
    assert.deepEqual(await signUpWithEmail("b@uci.edu", "secret"), { user: "created", session: null });
    const unsubscribe = onAuthSessionChange(() => {
      callbackCount += 1;
    });
    unsubscribe();
    await signOut();

    assert.equal(callbackCount, 1);
    assert.deepEqual(calls, [
      JSON.stringify({ email: "a@uci.edu", password: "secret" }),
      JSON.stringify({ email: "b@uci.edu", password: "secret" }),
      "unsubscribe",
      "signOut"
    ]);
  } finally {
    (supabase as { auth: unknown }).auth = previousAuth;
  }
});

function mockSupabaseFrom(factory: (table: string) => unknown) {
  (supabase as { from: (table: string) => unknown }).from = factory;
}

function query({
  data,
  error,
  singleData,
  singleError,
  fallbackSingleData,
  onInsert,
  onUpsert
}: {
  data?: unknown;
  error?: unknown;
  singleData?: unknown;
  singleError?: unknown;
  fallbackSingleData?: unknown;
  onInsert?: (row: unknown) => void;
  onUpsert?: (row: unknown, options?: unknown) => void;
}) {
  let upsertCount = 0;
  const builder = {
    select: () => builder,
    eq: () => builder,
    order: () => Promise.resolve({ data, error }),
    limit: () => Promise.resolve({ data, error }),
    maybeSingle: () => Promise.resolve({ data, error }),
    single: () => {
      if (singleError) {
        return Promise.resolve({ data: singleData, error: singleError });
      }
      return Promise.resolve({ data: singleData ?? data, error });
    },
    insert: (row: unknown) => {
      onInsert?.(row);
      return {
        select: () => ({
          single: () => Promise.resolve({ data: singleData ?? data, error })
        })
      };
    },
    upsert: (row: unknown, options?: unknown) => {
      onUpsert?.(row, options);
      upsertCount += 1;
      return {
        select: () => ({
          single: () =>
            Promise.resolve({
              data: upsertCount > 1 && fallbackSingleData ? fallbackSingleData : singleData ?? data,
              error: upsertCount === 1 ? singleError ?? error : error
            })
        })
      };
    },
    then: (resolve: (value: unknown) => void) => resolve({ data, error })
  };
  return builder;
}
