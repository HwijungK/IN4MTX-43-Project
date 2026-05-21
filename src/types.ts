export type Tab = "map" | "discover" | "chats" | "communities" | "profile";

export type Stage = "login" | "setup" | "app";

export type Interest = {
  id: string;
  label: string;
  subscribers: number;
  activeNearby: number;
};

export type NearbyUser = {
  id: string;
  name: string;
  age: number;
  distance: string;
  identity: string;
  university: string;
  campusZone: string;
  interests: string[];
  status: string;
  friendScore: number;
};

export type NearbyGroup = {
  id: string;
  name: string;
  campusZone: string;
  interest: string;
  peopleHere: number;
  note: string;
};

export type Chat = {
  id: string;
  title: string;
  kind: "Proximity" | "Friends" | "Community";
  preview: string;
  participants: number;
  expires?: string;
};

export type ChatMessage = {
  id: string;
  chatId: string;
  sender: string;
  content: string;
  time: string;
  isMine?: boolean;
};

export type Community = {
  id: string;
  name: string;
  tag: string;
  distance: string;
  members: number;
  privacy: "Public" | "Request";
  announcement: string;
  event: string;
};
