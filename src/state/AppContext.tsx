import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";

import {
  chats,
  chatMessages,
  communities,
  interests,
  nearbyGroups,
  nearbyUsers
} from "../data/mockData";
import type { Community, Interest, NearbyGroup, NearbyUser } from "../types";
import {
  getCurrentSession,
  onAuthSessionChange,
  signInWithEmail,
  signOut as signOutOfSupabase,
  signUpWithEmail
} from "../services/authService";
import {
  getProfile,
  getUniversityById,
  getUniversityByName,
  profileToAppFields,
  upsertProfile
} from "../services/profileService";
import type { ProfileRow } from "../services/profileService";

type AppContextValue = {
  ageRange: string;
  authError: string;
  authLoading: boolean;
  bio: string;
  blockedUsers: string[];
  chats: typeof chats;
  chatMessages: typeof chatMessages;
  communities: typeof communities;
  displayName: string;
  filteredTags: Interest[];
  friends: NearbyUser[];
  identity: string;
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
  visibleUsers: NearbyUser[];
  addFriend: (user: NearbyUser) => void;
  addTag: (label: string) => void;
  blockUser: (id: string) => void;
  createTagFromQuery: () => void;
  joinCommunity: (community: Community) => void;
  prepareSignup: (email: string, password: string) => void;
  removeTag: (tag: string) => void;
  setAgeRange: (value: string) => void;
  setBio: (value: string) => void;
  setDisplayName: (value: string) => void;
  setIdentity: (value: string) => void;
  setSelectedTags: (updater: (current: string[]) => string[]) => void;
  setTagQuery: (value: string) => void;
  setUniversity: (value: string) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUpAndCreateProfile: () => Promise<void>;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [sessionReady, setSessionReady] = useState(false);
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [pendingSignupEmail, setPendingSignupEmail] = useState("");
  const [pendingSignupPassword, setPendingSignupPassword] = useState("");
  const [displayName, setDisplayName] = useState("Alex");
  const [bio, setBio] = useState("Trying new hobbies and making campus friends.");
  const [identity, setIdentity] = useState("University student");
  const [university, setUniversity] = useState("UC Irvine");
  const [ageRange, setAgeRange] = useState("18-24");
  const [selectedTags, setSelectedTags] = useState<string[]>(["#coffee", "#photography"]);
  const [tagQuery, setTagQuery] = useState("");
  const [blockedUsers, setBlockedUsers] = useState<string[]>([]);
  const [friendIds, setFriendIds] = useState<string[]>(["maya", "jordan", "nina"]);
  const [joinedCommunities, setJoinedCommunities] = useState<string[]>(["third-place"]);
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

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const visibleUsers = nearbyUsers.filter((user) => !blockedUsers.includes(user.id));
  const friends = visibleUsers.filter((user) => friendIds.includes(user.id));
  const suggestedFriends = visibleUsers.filter((user) => !friendIds.includes(user.id));

  const filteredTags = useMemo(() => {
    const query = tagQuery.trim().toLowerCase();
    if (!query) {
      return interests;
    }
    return interests.filter((interest) => interest.label.toLowerCase().includes(query));
  }, [tagQuery]);

  function addTag(label: string) {
    if (selectedTags.includes(label)) {
      setNotice(`${label} is already on your profile.`);
      return;
    }
    setSelectedTags((current) => [...current, label]);
    setNotice(`${label} added to your profile.`);
  }

  function createTagFromQuery() {
    const cleaned = tagQuery.trim().replace(/^#/, "").toLowerCase();
    if (!cleaned) {
      setNotice("Tags cannot be blank.");
      return;
    }
    addTag(`#${cleaned}`);
    setTagQuery("");
  }

  function addFriend(user: NearbyUser) {
    setFriendIds((current) => (current.includes(user.id) ? current : [...current, user.id]));
    setNotice(`${user.name} was added to your friends.`);
  }

  function blockUser(id: string) {
    setBlockedUsers((current) => [...current, id]);
    setNotice("User removed from map and proximity chats.");
  }

  function joinCommunity(community: Community) {
    if (community.privacy === "Request") {
      setNotice(`Request sent to ${community.name}.`);
      return;
    }
    setJoinedCommunities((current) =>
      current.includes(community.id) ? current : [...current, community.id]
    );
    setNotice(`Joined ${community.name}.`);
  }

  function removeTag(tag: string) {
    setSelectedTags((current) => current.filter((item) => item !== tag));
  }

  function prepareSignup(email: string, password: string) {
    setPendingSignupEmail(email.trim());
    setPendingSignupPassword(password);
    setAuthError("");
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
    setAgeRange(appFields.ageRange);
    setUniversity(appFields.university);
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
    if (!ageRange.trim()) {
      setAuthError("Age range cannot be blank.");
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
        setAuthError("Account created. Check your email to confirm it, then log in.");
        return;
      }

      setSession(nextSession);
      const nextProfile = await upsertProfile({
        id: nextSession.user.id,
        displayName,
        bio,
        identity,
        ageRange,
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
      setSession(null);
      setProfile(null);
    } catch (error) {
      setAuthError(getErrorMessage(error));
    } finally {
      setAuthLoading(false);
    }
  }

  const value: AppContextValue = {
    ageRange,
    authError,
    authLoading,
    bio,
    blockedUsers,
    chats,
    chatMessages,
    communities,
    displayName,
    filteredTags,
    friends,
    identity,
    joinedCommunities,
    nearbyGroups,
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
    visibleUsers,
    addFriend,
    addTag,
    blockUser,
    createTagFromQuery,
    joinCommunity,
    prepareSignup,
    removeTag,
    setAgeRange,
    setBio,
    setDisplayName,
    setIdentity,
    setSelectedTags,
    setTagQuery,
    setUniversity,
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
  return "Something went wrong.";
}

export function useAppContext() {
  const value = useContext(AppContext);
  if (!value) {
    throw new Error("useAppContext must be used inside AppProvider");
  }
  return value;
}
