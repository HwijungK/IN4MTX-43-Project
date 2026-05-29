# Supabase Setup

This project is ready to connect to Supabase, but secrets are intentionally not committed.

## 1. Create a Supabase Project

Go to the Supabase dashboard and create a project.

## 2. Create Your Local `.env`

Copy the example file:

```bash
cp .env.example .env
```

Open `.env` and fill in these values:

```env
EXPO_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_OR_PUBLISHABLE_KEY
```

Find both values in:

```text
Supabase Dashboard -> Project Settings -> API
```

Use:

- `Project URL` for `EXPO_PUBLIC_SUPABASE_URL`
- `anon public` / publishable key for `EXPO_PUBLIC_SUPABASE_ANON_KEY`

Never put this in the app:

```text
service_role key
```

The service role key bypasses Row Level Security and must only be used on a trusted server.

## 3. Run the Schema

Open:

```text
supabase/schema.sql
```

Copy it into:

```text
Supabase Dashboard -> SQL Editor -> New query
```

Run the SQL. It creates:

- universities
- profiles
- interests
- user interests
- fuzzy user locations
- friendships
- communities
- community members
- community join requests
- community events
- event attendance
- chats
- chat participants
- chat messages
- blocks
- reports

It also enables Row Level Security and creates starter policies.

If you ran an older schema that created `profiles.age_range`, run this migration too:

```text
supabase/migrate-age-range-to-age.sql
```

To load the database-backed demo rows for interests, nearby users, chats, communities, and the expanded university list, run:

```text
supabase/migrate-demo-data.sql
```

## 4. Restart Expo

Expo reads environment variables when the dev server starts. After changing `.env`, restart:

```bash
npm run start
```

If the cache is stale:

```bash
npx expo start --clear
```

## 5. Where the App Connects

The Supabase client is here:

```text
src/lib/supabase.ts
```

That file reads:

```ts
process.env.EXPO_PUBLIC_SUPABASE_URL
process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
```

The current UI still uses mock data. The next implementation step is replacing one slice at a time, starting with auth/profile.

## 6. Auth + Profile Flow

The app now connects login/signup and profile setup to Supabase:

```text
Login screen
-> supabase.auth.signInWithPassword
-> load profiles row
-> Main tabs if profile exists
```

```text
Create account
-> Setup screen
-> supabase.auth.signUp
-> insert/update profiles row
-> Main tabs after profile is saved
```

If email confirmation is enabled in Supabase Auth settings, Supabase may create the account without returning a signed-in session. In that case the app continues into the UI in test mode, but the profile row cannot be saved until the user has a real session. For class/demo speed, you can disable email confirmation in:

```text
Supabase Dashboard -> Authentication -> Providers -> Email
```

Keep it enabled later if you want stricter account verification.
