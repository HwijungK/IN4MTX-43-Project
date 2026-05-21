import type { Chat, ChatMessage, Community, Interest, NearbyGroup, NearbyUser } from "../types";

export const universities = [
  "UC Irvine",
  "UCLA",
  "UC San Diego",
  "UC Berkeley",
  "Cal State Fullerton"
];

export const identityGroups = ["Child", "University student", "Adult"];

export const interests: Interest[] = [
  { id: "climbing", label: "#climbing", subscribers: 1280, activeNearby: 34 },
  { id: "coffee", label: "#coffee", subscribers: 932, activeNearby: 41 },
  { id: "photography", label: "#photography", subscribers: 870, activeNearby: 18 },
  { id: "boardgames", label: "#boardgames", subscribers: 542, activeNearby: 12 },
  { id: "running", label: "#running", subscribers: 1470, activeNearby: 52 },
  { id: "film", label: "#film", subscribers: 613, activeNearby: 16 }
];

export const nearbyUsers: NearbyUser[] = [
  {
    id: "maya",
    name: "Maya",
    age: 21,
    distance: "0.2 mi",
    identity: "University student",
    university: "UC Irvine",
    campusZone: "Aldrich Park",
    interests: ["#climbing", "#coffee", "#photography"],
    status: "Looking for a cafe study break",
    friendScore: 92
  },
  {
    id: "jordan",
    name: "Jordan",
    age: 22,
    distance: "0.4 mi",
    identity: "University student",
    university: "UC Irvine",
    campusZone: "ARC",
    interests: ["#running", "#boardgames"],
    status: "Training for a campus 10k this month",
    friendScore: 81
  },
  {
    id: "nina",
    name: "Nina",
    age: 20,
    distance: "0.6 mi",
    identity: "University student",
    university: "UC Irvine",
    campusZone: "Student Center",
    interests: ["#film", "#photography", "#coffee"],
    status: "Finding people for a movie night",
    friendScore: 76
  },
  {
    id: "sam",
    name: "Sam",
    age: 19,
    distance: "0.3 mi",
    identity: "University student",
    university: "UCLA",
    campusZone: "Bruin Plaza",
    interests: ["#boardgames", "#film", "#coffee"],
    status: "Always down for strategy games after class",
    friendScore: 88
  },
  {
    id: "lena",
    name: "Lena",
    age: 22,
    distance: "0.5 mi",
    identity: "University student",
    university: "UC San Diego",
    campusZone: "Price Center",
    interests: ["#photography", "#running"],
    status: "Looking for people to explore new photo spots",
    friendScore: 84
  },
  {
    id: "omar",
    name: "Omar",
    age: 24,
    distance: "0.8 mi",
    identity: "University student",
    university: "UC Irvine",
    campusZone: "Engineering Quad",
    interests: ["#coffee", "#running", "#climbing"],
    status: "Coffee walks between project sessions",
    friendScore: 79
  }
];

export const nearbyGroups: NearbyGroup[] = [
  {
    id: "study-lawn",
    name: "Study lawn cluster",
    campusZone: "Aldrich Park",
    interest: "#coffee",
    peopleHere: 8,
    note: "Loose group studying before evening classes"
  },
  {
    id: "arc-run",
    name: "ARC running meetup",
    campusZone: "ARC",
    interest: "#running",
    peopleHere: 11,
    note: "Informal warmup group near the track"
  }
];

export const chats: Chat[] = [
  {
    id: "nearby",
    title: "Aldrich Park campus chat",
    kind: "Proximity",
    preview: "Anyone heading to the outdoor movie later?",
    participants: 14,
    expires: "Campus chat dissolves unless you become friends"
  },
  {
    id: "maya",
    title: "Maya",
    kind: "Friends",
    preview: "Want to meet by the coffee cart at 3?",
    participants: 2
  },
  {
    id: "photo-walk",
    title: "Photo Walk",
    kind: "Community",
    preview: "Meetup route posted for Saturday morning.",
    participants: 38
  }
];

export const chatMessages: ChatMessage[] = [
  {
    id: "nearby-1",
    chatId: "nearby",
    sender: "Maya",
    content: "Anyone heading to the outdoor movie later?",
    time: "2:14 PM"
  },
  {
    id: "nearby-2",
    chatId: "nearby",
    sender: "You",
    content: "I might. Is the group meeting near the flagpoles?",
    time: "2:16 PM",
    isMine: true
  },
  {
    id: "nearby-3",
    chatId: "nearby",
    sender: "Jordan",
    content: "Yep, a few of us are grabbing coffee first.",
    time: "2:18 PM"
  },
  {
    id: "maya-1",
    chatId: "maya",
    sender: "Maya",
    content: "Want to meet by the coffee cart at 3?",
    time: "1:42 PM"
  },
  {
    id: "maya-2",
    chatId: "maya",
    sender: "You",
    content: "That works. I will bring my camera too.",
    time: "1:47 PM",
    isMine: true
  },
  {
    id: "photo-walk-1",
    chatId: "photo-walk",
    sender: "Nina",
    content: "Meetup route posted for Saturday morning.",
    time: "Yesterday"
  },
  {
    id: "photo-walk-2",
    chatId: "photo-walk",
    sender: "You",
    content: "I can join for the first half.",
    time: "Yesterday",
    isMine: true
  }
];

export const communities: Community[] = [
  {
    id: "trail-runners",
    name: "Campus Trail Runners",
    tag: "#running",
    distance: "0.3 mi",
    members: 212,
    privacy: "Public",
    announcement: "Informal easy pace loop this Friday.",
    event: "Friday 5:30 PM"
  },
  {
    id: "beginner-climbers",
    name: "Beginner Climbers",
    tag: "#climbing",
    distance: "1.1 mi",
    members: 87,
    privacy: "Request",
    announcement: "Student-led gear check and belay basics.",
    event: "Saturday 10:00 AM"
  },
  {
    id: "third-place",
    name: "Third Place Coffee",
    tag: "#coffee",
    distance: "0.5 mi",
    members: 154,
    privacy: "Public",
    announcement: "Unofficial study table reservation thread.",
    event: "Today 2:00 PM"
  }
];
