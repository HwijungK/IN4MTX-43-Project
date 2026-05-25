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
