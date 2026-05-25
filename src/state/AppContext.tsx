import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";

import {
  chats,
  chatMessages,
  communities,
  interests,
  universities as fallbackUniversities,
  nearbyGroups,
  nearbyUsers
} from "../data/mockData";
import type { Chat, ChatMessage, Community, Interest, NearbyGroup, NearbyUser } from "../types";
import {
  getDemoChatMessages,
  getDemoChats,
  getDemoCommunities,
  getDemoFriendIds,
  getDemoInterests,
  getDemoJoinedCommunityIds,
  getDemoNearbyGroups,
  getDemoNearbyUsers,
  getDemoSelectedTags
} from "../services/demoDataService";
import {
  getCurrentSession,
  onAuthSessionChange,
  signInWithEmail,
  signOut as signOutOfSupabase,
  signUpWithEmail
} from "../services/authService";
import {
  addAcceptedFriend,
  addInterestToProfile,
  getProfileInterestLabels,
  joinPublicCommunity,
  requestCommunityJoin
} from "../services/socialService";
import {
  getProfile,
  getUniversities,
  getUniversityById,
  getUniversityByName,
  profileToAppFields,
  upsertProfile
} from "../services/profileService";
import type { ProfileRow } from "../services/profileService";

type AppContextValue = {
  age: string;
  authError: string;
  authLoading: boolean;
  bio: string;
  blockedUsers: string[];
  chats: Chat[];
  chatMessages: ChatMessage[];
  communities: Community[];
  displayName: string;
  devBypassAuth: boolean;
  filteredTags: Interest[];
  friends: NearbyUser[];
  identity: string;
  interestChoices: Interest[];
  joinedCommunities: string[];
  nearbyGroups: NearbyGroup[];
  notice: string;
  pendingSignupEmail: string;
  pendingSignupPassword: string;
  profile: ProfileRow | null;
  selectedTags: string[];
  session: Session | null;
  sessionReady: boolean;
  suggestedFriends: NearbyUser[];
  tagQuery: string;
  university: string;
  universityChoices: string[];
  visibleUsers: NearbyUser[];
  addFriend: (user: NearbyUser) => Promise<void>;
  addTag: (label: string) => Promise<void>;
  blockUser: (id: string) => void;
  createTagFromQuery: () => Promise<void>;
  enterDevBypass: () => void;
  joinCommunity: (community: Community) => Promise<void>;
  setPendingSignupEmail: (value: string) => void;
  setPendingSignupPassword: (value: string) => void;
  removeTag: (tag: string) => void;
  setAge: (value: string) => void;
  setBio: (value: string) => void;
  setDisplayName: (value: string) => void;
  setIdentity: (value: string) => void;
  setSelectedTags: (updater: (current: string[]) => string[]) => void;
  setTagQuery: (value: string) => void;
  setUniversity: (value: string) => void;
  saveProfile: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUpAndCreateProfile: () => Promise<void>;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [sessionReady, setSessionReady] = useState(false);
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [devBypassAuth, setDevBypassAuth] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [pendingSignupEmail, setPendingSignupEmail] = useState("");
  const [pendingSignupPassword, setPendingSignupPassword] = useState("");
  const [displayName, setDisplayName] = useState("Alex");
  const [bio, setBio] = useState("Trying new hobbies and making campus friends.");
  const [identity, setIdentity] = useState("University student");
  const [university, setUniversity] = useState("UC Irvine");
  const [universityChoices, setUniversityChoices] = useState<string[]>(fallbackUniversities);
  const [age, setAge] = useState("21");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagQuery, setTagQuery] = useState("");
  const [blockedUsers, setBlockedUsers] = useState<string[]>([]);
  const [interestChoices, setInterestChoices] = useState<Interest[]>(interests);
  const [nearbyUserRows, setNearbyUserRows] = useState<NearbyUser[]>(nearbyUsers);
  const [nearbyGroupRows, setNearbyGroupRows] = useState<NearbyGroup[]>(nearbyGroups);
  const [chatRows, setChatRows] = useState<Chat[]>(chats);
  const [chatMessageRows, setChatMessageRows] = useState<ChatMessage[]>(chatMessages);
  const [communityRows, setCommunityRows] = useState<Community[]>(communities);
  const [friendIds, setFriendIds] = useState<string[]>([]);
  const [joinedCommunities, setJoinedCommunities] = useState<string[]>([]);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadSession() {
      try {
        const currentSession = await getCurrentSession();
        if (!isMounted) {
          return;
        }
        setSession(currentSession);
        if (currentSession?.user.id) {
          await loadProfile(currentSession.user.id);
        }
      } catch (error) {
        if (isMounted) {
          setAuthError(getErrorMessage(error));
        }
      } finally {
        if (isMounted) {
          setSessionReady(true);
        }
      }
    }

    const unsubscribe = onAuthSessionChange(() => {
      void refreshSession().catch((error) => {
        setAuthError(getErrorMessage(error));
      });
    });
    void loadSession();
    void loadUniversityChoices();
    void loadDemoRows();

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const visibleUsers = nearbyUserRows.filter((user) => !blockedUsers.includes(user.id));
  const friends = visibleUsers.filter((user) => friendIds.includes(user.id));
  const suggestedFriends = visibleUsers.filter((user) => !friendIds.includes(user.id));

  const filteredTags = useMemo(() => {
    const query = tagQuery.trim().toLowerCase();
    if (!query) {
      return interestChoices;
    }
    return interestChoices.filter((interest) => interest.label.toLowerCase().includes(query));
  }, [interestChoices, tagQuery]);

  async function addTag(label: string) {
    const normalized = normalizeInterestLabel(label);
    if (normalized === "#") {
      setNotice("Tags need at least one letter or number.");
      return;
    }
    if (selectedTags.includes(normalized)) {
      setNotice(`${normalized} is already on your profile.`);
      return;
    }

    if (devBypassAuth || !session?.user.id) {
      setSelectedTags((current) => [...current, normalized]);
      setNotice(`${normalized} added locally in test mode.`);
      return;
    }

    try {
      const savedLabel = await addInterestToProfile(session.user.id, normalized);
      setSelectedTags((current) => (current.includes(savedLabel) ? current : [...current, savedLabel]));
      setNotice(`${savedLabel} added to your profile.`);
    } catch (error) {
      setAuthError(getErrorMessage(error));
    }
  }

  async function createTagFromQuery() {
    const cleaned = tagQuery.trim().replace(/^#/, "").toLowerCase();
    if (!cleaned) {
      setNotice("Tags cannot be blank.");
      return;
    }

    await addTag(`#${cleaned}`);
    setTagQuery("");
  }

  async function addFriend(user: NearbyUser) {
    if (friendIds.includes(user.id)) {
      setNotice(`${user.name} is already in your friends.`);
      return;
    }

    if (devBypassAuth || !session?.user.id || !user.profileId) {
      setFriendIds((current) => (current.includes(user.id) ? current : [...current, user.id]));
      setNotice(`${user.name} was added locally in test mode.`);
      return;
    }

    try {
      await addAcceptedFriend(session.user.id, user.profileId);
      setFriendIds((current) => (current.includes(user.id) ? current : [...current, user.id]));
      setNotice(`${user.name} was added to your friends.`);
    } catch (error) {
      setAuthError(getErrorMessage(error));
    }
  }

  function blockUser(id: string) {
    setBlockedUsers((current) => [...current, id]);
    setNotice("User removed from map and proximity chats.");
  }

  async function joinCommunity(community: Community) {
    if (joinedCommunities.includes(community.id)) {
      setNotice(`You are already in ${community.name}.`);
      return;
    }

    if (devBypassAuth || !session?.user.id || !community.communityId) {
      if (community.privacy === "Request") {
        setNotice(`Request sent to ${community.name} locally in test mode.`);
        return;
      }
      setJoinedCommunities((current) =>
        current.includes(community.id) ? current : [...current, community.id]
      );
      setNotice(`Joined ${community.name} locally in test mode.`);
      return;
    }

    if (community.privacy === "Request") {
      try {
        await requestCommunityJoin(session.user.id, community.communityId);
        setNotice(`Request sent to ${community.name}.`);
      } catch (error) {
        setAuthError(getErrorMessage(error));
      }
      return;
    }

    try {
      await joinPublicCommunity(session.user.id, community.communityId);
      setJoinedCommunities((current) =>
        current.includes(community.id) ? current : [...current, community.id]
      );
      setNotice(`Joined ${community.name}.`);
    } catch (error) {
      setAuthError(getErrorMessage(error));
    }
  }

  function removeTag(tag: string) {
    setSelectedTags((current) => current.filter((item) => item !== tag));
  }

  function enterDevBypass() {
    setDevBypassAuth(true);
    setAuthError("");
    setNotice("Using test mode. Backend auth is bypassed.");
  }

  async function refreshSession() {
    const currentSession = await getCurrentSession();
    setSession(currentSession);
    if (currentSession?.user.id) {
      await loadProfile(currentSession.user.id);
      return;
    }
    setProfile(null);
  }

  async function loadProfile(userId: string) {
    const nextProfile = await getProfile(userId);
    setProfile(nextProfile);

    if (!nextProfile) {
      return;
    }

    const university = nextProfile.university_id ? await getUniversityById(nextProfile.university_id) : null;
    const appFields = profileToAppFields(nextProfile, university);
    setDisplayName(appFields.displayName);
    setBio(appFields.bio);
    setIdentity(appFields.identity);
    setAge(appFields.age);
    setUniversity(appFields.university);

    const interestLabels = await getProfileInterestLabels(userId);
    setSelectedTags(interestLabels);
  }

  async function loadUniversityChoices() {
    try {
      const rows = await getUniversities();
      const names = rows.map((row) => row.name);
      if (names.length) {
        setUniversityChoices(names);
      }
    } catch (error) {
      setAuthError(getErrorMessage(error));
    }
  }

  async function loadDemoRows() {
    try {
      const [
        nextInterests,
        nextNearbyUsers,
        nextNearbyGroups,
        nextChats,
        nextChatMessages,
        nextCommunities,
        nextFriendIds,
        nextSelectedTags,
        nextJoinedCommunityIds
      ] = await Promise.all([
        getDemoInterests(),
        getDemoNearbyUsers(),
        getDemoNearbyGroups(),
        getDemoChats(),
        getDemoChatMessages(),
        getDemoCommunities(),
        getDemoFriendIds(),
        getDemoSelectedTags(),
        getDemoJoinedCommunityIds()
      ]);

      if (nextInterests.length) {
        setInterestChoices(nextInterests);
      }
      if (nextNearbyUsers.length) {
        setNearbyUserRows(nextNearbyUsers);
      }
      if (nextNearbyGroups.length) {
        setNearbyGroupRows(nextNearbyGroups);
      }
      if (nextChats.length) {
        setChatRows(nextChats);
      }
      if (nextChatMessages.length) {
        setChatMessageRows(nextChatMessages);
      }
      if (nextCommunities.length) {
        setCommunityRows(nextCommunities);
      }
      if (nextFriendIds.length) {
        setFriendIds(nextFriendIds);
      }
      if (nextSelectedTags.length) {
        setSelectedTags(nextSelectedTags);
      }
      if (nextJoinedCommunityIds.length) {
        setJoinedCommunities(nextJoinedCommunityIds);
      }
    } catch {
      // Demo rows are loaded from an optional seed script; keep auth usable if they are absent.
    }
  }

  async function signIn(email: string, password: string) {
    setAuthLoading(true);
    setAuthError("");
    try {
      const nextSession = await signInWithEmail(email.trim(), password);
      setSession(nextSession);
      if (nextSession?.user.id) {
        await loadProfile(nextSession.user.id);
      }
    } catch (error) {
      setAuthError(getErrorMessage(error));
    } finally {
      setAuthLoading(false);
    }
  }

  async function signUpAndCreateProfile() {
    if (!displayName.trim()) {
      setAuthError("Display name cannot be blank.");
      return;
    }
    if (!isWholeNumber(age)) {
      setAuthError("Age must be a whole number.");
      return;
    }

    setAuthLoading(true);
    setAuthError("");
    try {
      let nextSession = session;

      if (!nextSession) {
        const email = pendingSignupEmail.trim();
        const password = pendingSignupPassword;

        if (!email || !password) {
          setAuthError("Enter an email and password before creating an account.");
          return;
        }

        const signup = await signUpWithEmail(email, password);
        nextSession = signup.session;
      }

      if (!nextSession) {
        setDevBypassAuth(true);
        setNotice("Account created. Continuing in test mode.");
        return;
      }

      setSession(nextSession);
      const nextProfile = await upsertProfile({
        id: nextSession.user.id,
        displayName,
        bio,
        identity,
        age,
        university
      });
      await Promise.all(selectedTags.map((tag) => addInterestToProfile(nextSession.user.id, tag)));
      setProfile(nextProfile);
      setNotice("Profile saved.");
    } catch (error) {
      setAuthError(getErrorMessage(error));
    } finally {
      setAuthLoading(false);
    }
  }

  async function saveProfile() {
    if (!displayName.trim()) {
      setAuthError("Display name cannot be blank.");
      return;
    }
    if (!isWholeNumber(age)) {
      setAuthError("Age must be a whole number.");
      return;
    }

    setAuthLoading(true);
    setAuthError("");
    try {
      if (devBypassAuth || !session?.user.id) {
        setNotice("Profile saved locally in test mode.");
        return;
      }

      const nextProfile = await upsertProfile({
        id: session.user.id,
        displayName,
        bio,
        identity,
        age,
        university
      });
      setProfile(nextProfile);
      setNotice("Profile saved.");
    } catch (error) {
      setAuthError(getErrorMessage(error));
    } finally {
      setAuthLoading(false);
    }
  }

  async function signOut() {
    setAuthLoading(true);
    setAuthError("");
    try {
      await signOutOfSupabase();
    } catch (error) {
      setAuthError(getErrorMessage(error));
    } finally {
      setSession(null);
      setProfile(null);
      setDevBypassAuth(false);
      setAuthLoading(false);
    }
  }

  const value: AppContextValue = {
    age,
    authError,
    authLoading,
    bio,
    blockedUsers,
    chats: chatRows,
    chatMessages: chatMessageRows,
    communities: communityRows,
    displayName,
    devBypassAuth,
    filteredTags,
    friends,
    identity,
    interestChoices,
    joinedCommunities,
    nearbyGroups: nearbyGroupRows,
    notice,
    pendingSignupEmail,
    pendingSignupPassword,
    profile,
    selectedTags,
    session,
    sessionReady,
    suggestedFriends,
    tagQuery,
    university,
    universityChoices,
    visibleUsers,
    addFriend,
    addTag,
    blockUser,
    createTagFromQuery,
    enterDevBypass,
    joinCommunity,
    removeTag,
    setAge,
    setBio,
    setDisplayName,
    setIdentity,
    setPendingSignupEmail,
    setPendingSignupPassword,
    setSelectedTags,
    setTagQuery,
    setUniversity,
    saveProfile,
    signIn,
    signOut,
    signUpAndCreateProfile
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }
  if (error && typeof error === "object") {
    const possibleError = error as { error_description?: string; message?: string };
    return possibleError.message ?? possibleError.error_description ?? "Something went wrong.";
  }
  return "Something went wrong.";
}

function isWholeNumber(value: string) {
  return /^\d+$/.test(value.trim());
}

function normalizeInterestLabel(label: string) {
  const slug = label
    .trim()
    .replace(/^#/, "")
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, "_")
    .replace(/^_+|_+$/g, "");
  return `#${slug}`;
}

export function useAppContext() {
  const value = useContext(AppContext);
  if (!value) {
    throw new Error("useAppContext must be used inside AppProvider");
  }
  return value;
}
