import type { Tab } from "../types";

export function shortUniversity(university: string) {
  const abbreviations: Record<string, string> = {
    "UC Irvine": "UCI",
    UCLA: "UCLA",
    "UC San Diego": "UCSD",
    "UC Berkeley": "UC Berkeley",
    "Cal State Fullerton": "CSUF"
  };
  return abbreviations[university] ?? university;
}

export function tabLabel(tab: Tab) {
  const labels: Record<Tab, string> = {
    map: "Map",
    discover: "Friends",
    chats: "Chats",
    communities: "Communities",
    profile: "Profile"
  };
  return labels[tab];
}
