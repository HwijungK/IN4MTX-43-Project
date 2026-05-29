import assert from "node:assert/strict";
import test from "node:test";
import React from "react";

import { PrimaryButton, SecondaryButton, SmallButton } from "../../src/components/Button";
import { ChoiceChips } from "../../src/components/ChoiceChips";
import { Field } from "../../src/components/Field";
import { Header } from "../../src/components/Header";
import { Notice } from "../../src/components/Notice";
import { Screen, ScrollableScreen } from "../../src/components/Screen";
import { TagPicker, TagRow } from "../../src/components/Tags";
import { CommunitiesScreen } from "../../src/screens/CommunitiesScreen";
import { MapScreen } from "../../src/screens/MapScreen";
import { ProfileScreen } from "../../src/screens/ProfileScreen";
import { ReadOnlyProfileScreen } from "../../src/screens/ReadOnlyProfileScreen";

test("implementation: button components render valid pressable elements", () => {
  const noop = () => undefined;

  assert.equal(React.isValidElement(PrimaryButton({ label: "Save", onPress: noop })), true);
  assert.equal(React.isValidElement(SecondaryButton({ label: "Cancel", onPress: noop })), true);
  assert.equal(React.isValidElement(SmallButton({ label: "Add", onPress: noop, disabled: true })), true);
});

test("implementation: form and layout components render valid elements", () => {
  assert.equal(
    React.isValidElement(ChoiceChips({ choices: ["UC Irvine", "UCLA"], selected: "UC Irvine", onSelect: () => undefined })),
    true
  );
  assert.equal(
    React.isValidElement(Field({ label: "Age", value: "21", onChangeText: () => undefined, keyboardType: "number-pad" })),
    true
  );
  assert.equal(React.isValidElement(Header({ title: "Campus setup", subtitle: "Build your profile." })), true);
});

test("implementation: notice and screen wrappers handle empty and populated states", () => {
  assert.equal(Notice({ text: "" }), null);
  assert.equal(React.isValidElement(Notice({ text: "Saved." })), true);
  assert.equal(React.isValidElement(Screen({ children: React.createElement("Text", null, "Child") })), true);
  assert.equal(React.isValidElement(ScrollableScreen({ children: React.createElement("Text", null, "Child") })), true);
});

test("implementation: tag picker and tag row render tag collections", () => {
  assert.equal(
    React.isValidElement(
      TagPicker({
        interests: [
          { id: "coffee", label: "#coffee", subscribers: 10, activeNearby: 2 },
          { id: "film", label: "#film", subscribers: 8, activeNearby: 1 }
        ],
        selectedTags: ["#coffee"],
        onToggle: () => undefined
      })
    ),
    true
  );
  assert.equal(React.isValidElement(TagRow({ tags: ["#coffee", "#film"] })), true);
});

test("implementation: communities screen renders public and request community actions", () => {
  const element = CommunitiesScreen({
    communities: [
      {
        id: "third-place",
        communityId: "community-1",
        name: "Third Place Coffee",
        tag: "#coffee",
        distance: "0.5 mi",
        members: 154,
        privacy: "Public",
        announcement: "Study table thread.",
        event: "Today 2:00 PM"
      },
      {
        id: "beginner-climbers",
        communityId: "community-2",
        name: "Beginner Climbers",
        tag: "#climbing",
        distance: "1.1 mi",
        members: 87,
        privacy: "Request",
        announcement: "Belay basics.",
        event: "Saturday 10:00 AM"
      }
    ],
    joinedCommunities: ["third-place"],
    communityQuery: "",
    onCommunityQuery: () => undefined,
    onJoin: async () => undefined
  });

  assert.equal(React.isValidElement(element), true);
});

test("implementation: map screen renders users, groups, and campus tag actions", () => {
  const element = MapScreen({
    visibleUsers: [
      {
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
      }
    ],
    nearbyGroups: [
      {
        id: "study-lawn",
        name: "Study lawn cluster",
        campusZone: "Aldrich Park",
        interest: "#coffee",
        peopleHere: 8,
        note: "Loose group studying before evening classes"
      }
    ],
    university: "UC Irvine",
    selectedTags: ["#coffee"],
    filteredTags: [{ id: "coffee", label: "#coffee", subscribers: 10, activeNearby: 2 }],
    tagQuery: "",
    notice: "Loaded.",
    onTagQuery: () => undefined,
    onAddTag: async () => undefined,
    onCreateTag: async () => undefined,
    onAddFriend: async () => undefined,
    onStartChat: () => undefined,
    onViewProfile: () => undefined,
    onBlock: () => undefined
  });

  assert.equal(React.isValidElement(element), true);
});

test("implementation: profile screen renders saved profile fields and actions", () => {
  const element = ProfileScreen({
    displayName: "Alex",
    bio: "Trying new hobbies.",
    identity: "University student",
    university: "UC Irvine",
    universityChoices: ["UC Irvine", "UCLA"],
    age: "21",
    selectedTags: ["#coffee"],
    notice: "Profile saved.",
    authError: "",
    authLoading: false,
    onDisplayName: () => undefined,
    onBio: () => undefined,
    onIdentity: () => undefined,
    onUniversity: () => undefined,
    onAge: () => undefined,
    onRemoveTag: () => undefined,
    onSaveProfile: () => undefined,
    onSignOut: () => undefined
  });

  assert.equal(React.isValidElement(element), true);
});

test("implementation: read-only profile screen exposes profile data without edit callbacks", () => {
  let wentBack = false;
  const element = ReadOnlyProfileScreen({
    user: {
      id: "maya",
      profileId: "user-2",
      name: "Maya",
      age: 21,
      distance: "0.2 mi",
      identity: "University student",
      university: "UC Irvine",
      campusZone: "Aldrich Park",
      interests: ["#coffee", "#film"],
      status: "Looking for a cafe study break",
      friendScore: 92
    },
    onBack: () => {
      wentBack = true;
    }
  });

  assert.equal(React.isValidElement(element), true);
  const children = element.props.children as React.ReactElement[];
  const backButton = children.at(-1) as React.ReactElement<{ onPress: () => void }>;
  backButton.props.onPress();
  assert.equal(wentBack, true);
});

test("implementation: map screen wires friend card action callbacks to the selected user", () => {
  const actions: string[] = [];
  const user = {
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
  };
  const element = MapScreen({
    visibleUsers: [user],
    nearbyGroups: [],
    university: "UC Irvine",
    selectedTags: [],
    filteredTags: [],
    tagQuery: "",
    notice: "",
    onTagQuery: () => undefined,
    onAddTag: async () => undefined,
    onCreateTag: async () => undefined,
    onAddFriend: async (selected) => {
      actions.push(`add:${selected.id}`);
    },
    onStartChat: (selected) => {
      actions.push(`chat:${selected.id}`);
    },
    onViewProfile: (selected) => {
      actions.push(`profile:${selected.id}`);
    },
    onBlock: (id) => {
      actions.push(`block:${id}`);
    }
  });

  const actionButtons = findElements(element, (node) => {
    const props = node.props as { label?: string };
    return ["Profile", "Chat", "Add", "Block"].includes(props.label ?? "");
  });

  for (const button of actionButtons) {
    (button.props as { onPress: () => void }).onPress();
  }

  assert.deepEqual(actions, ["profile:maya", "chat:maya", "add:maya", "block:maya"]);
});

test("implementation: communities search separates joined and suggested matches", () => {
  const element = CommunitiesScreen({
    communities: [
      {
        id: "third-place",
        communityId: "community-1",
        name: "Third Place Coffee",
        tag: "#coffee",
        distance: "0.5 mi",
        members: 154,
        privacy: "Public",
        announcement: "Study table thread.",
        event: "Today 2:00 PM"
      },
      {
        id: "beginner-climbers",
        communityId: "community-2",
        name: "Beginner Climbers",
        tag: "#climbing",
        distance: "1.1 mi",
        members: 87,
        privacy: "Request",
        announcement: "Belay basics.",
        event: "Saturday 10:00 AM"
      }
    ],
    joinedCommunities: ["third-place"],
    communityQuery: "climb",
    onCommunityQuery: () => undefined,
    onJoin: async () => undefined
  });

  assert.equal(findText(element, "No joined communities match this search."), true);
  assert.equal(findText(element, "Beginner Climbers"), true);
});

test("implementation: chats screen separates pinned chats from all chats", async () => {
  const element = await renderChatsScreenWithState({
    stateValues: [null, null, ["maya"], [], "", "", []]
  });

  assert.equal(findText(element, "Pinned chats"), true);
  assert.equal(findText(element, "All chats"), true);
  assert.equal(findText(element, "Maya"), true);
  assert.equal(findText(element, "Study lawn cluster"), true);
  assert.equal(findText(element, "Pinned: Maya"), false);
});

test("implementation: chats screen opens focused chat thread and clears focus on back", async () => {
  const stateWrites: unknown[] = [];
  let clearedFocus = false;
  const element = await renderChatsScreenWithState({
    stateValues: ["maya", null, ["maya"], [], "", "", []],
    onStateWrite: (value) => stateWrites.push(value),
    focusedChatId: "maya",
    onClearFocusedChat: () => {
      clearedFocus = true;
    }
  });

  assert.equal(findText(element, "Want to meet by the coffee cart at 3?"), true);
  const backButton = findElements(element, (node) => (node.props as { label?: string }).label === "Back")[0];
  (backButton.props as { onPress: () => void }).onPress();

  assert.equal(clearedFocus, true);
  assert.deepEqual(stateWrites, ["maya", null]);
});

function findElements(
  element: React.ReactNode,
  predicate: (element: React.ReactElement) => boolean,
  matches: React.ReactElement[] = []
) {
  if (!React.isValidElement(element)) {
    return matches;
  }
  if (predicate(element)) {
    matches.push(element);
  }
  const props = element.props as { children?: React.ReactNode };
  React.Children.forEach(props.children, (child) => findElements(child, predicate, matches));
  return matches;
}

function findText(element: React.ReactNode, expected: string): boolean {
  if (typeof element === "string") {
    return element === expected;
  }
  if (!React.isValidElement(element)) {
    return false;
  }
  const props = element.props as { children?: React.ReactNode };
  return React.Children.toArray(props.children).some((child) => findText(child, expected));
}

async function renderChatsScreenWithState({
  stateValues,
  onStateWrite = () => undefined,
  focusedChatId = null,
  onClearFocusedChat = () => undefined
}: {
  stateValues: unknown[];
  onStateWrite?: (value: unknown) => void;
  focusedChatId?: string | null;
  onClearFocusedChat?: () => void;
}) {
  const restore = patchReactHooks(stateValues, onStateWrite);
  try {
    const { ChatsScreen } = await import("../../src/screens/ChatsScreen.js");
    return ChatsScreen({
      chats: [
        {
          id: "maya",
          title: "Maya",
          kind: "Friends",
          preview: "Want to meet by the coffee cart at 3?",
          participants: 2
        },
        {
          id: "study",
          title: "Study lawn cluster",
          kind: "Community",
          preview: "Meeting under the big tree at 3.",
          participants: 8
        }
      ],
      messages: [
        {
          id: "message-1",
          chatId: "maya",
          sender: "Maya",
          content: "Want to meet by the coffee cart at 3?",
          time: "Now"
        }
      ],
      notice: "",
      focusedChatId,
      onClearFocusedChat
    });
  } finally {
    restore();
  }
}

function patchReactHooks(stateValues: unknown[], onStateWrite: (value: unknown) => void) {
  const originalUseState = React.useState;
  const originalUseMemo = React.useMemo;
  const originalUseEffect = React.useEffect;
  let stateIndex = 0;

  Object.defineProperty(React, "useState", {
    configurable: true,
    value: (initial: unknown) => [
      stateValues[stateIndex++] ?? initial,
      (value: unknown) => onStateWrite(value)
    ]
  });
  Object.defineProperty(React, "useMemo", {
    configurable: true,
    value: (factory: () => unknown) => factory()
  });
  Object.defineProperty(React, "useEffect", {
    configurable: true,
    value: (effect: () => void | (() => void)) => {
      effect();
    }
  });

  return () => {
    Object.defineProperty(React, "useState", { configurable: true, value: originalUseState });
    Object.defineProperty(React, "useMemo", { configurable: true, value: originalUseMemo });
    Object.defineProperty(React, "useEffect", { configurable: true, value: originalUseEffect });
  };
}
