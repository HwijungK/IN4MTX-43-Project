# CommonGround

CommonGround is a campus-first mobile app prototype for helping students make
friendship-based, in-person connections through shared interests and proximity.

This first draft is an Expo React Native UI prototype. It uses local mock data so
the team can evaluate the core experience before adding Supabase, realtime chat,
push notifications, or real location services.

## Current Prototype Scope

- Simulated school email login
- Campus account setup
- Profile editing with interests
- Campus map-style view with fuzzy zones
- Friendship discovery flow
- Temporary campus proximity chats
- Communities, events, and announcements
- Campus interest leaderboard/search
- Block/report interface placeholders

## Run Locally

```bash
npm install
npm run start
```

Then open the app with Expo Go, an iOS simulator, an Android emulator, or the
Expo web preview.

## Product Direction

Current assumptions:

- Campus-first access model
- Friendship-focused connections
- Children, university students, and adults are supported as identity groups
- California university selection for the current prototype
- University-specific verified badges, such as Verified UCI or Verified UCLA
- Fuzzy campus zones instead of exact locations
- Fuzzy map markers for individual students and nearby groups
- Persistent chat should require a mutual friend connection
- Communities can be informal student-led groups, not only official campus organizations
