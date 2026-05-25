-- CommonGround Supabase schema
-- Run this in Supabase Dashboard -> SQL Editor.
--
-- Auth notes:
-- - This schema uses auth.users for accounts.
-- - The mobile app must use the anon/public key only.
-- - Keep Row Level Security enabled for all user data tables.

create extension if not exists pgcrypto;

do $$
begin
  create type public.identity_group as enum ('child', 'university_student', 'adult');
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.friendship_status as enum ('pending', 'accepted', 'declined', 'blocked');
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.chat_kind as enum ('proximity', 'friend', 'community');
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.community_privacy as enum ('public', 'request');
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.community_role as enum ('member', 'lead');
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.attendance_status as enum ('interested', 'attending', 'declined');
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.report_status as enum ('open', 'reviewed', 'dismissed');
exception when duplicate_object then null;
end $$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.universities (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  short_name text not null unique,
  email_domain text unique,
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (length(trim(display_name)) > 0),
  bio text,
  identity_group public.identity_group not null default 'university_student',
  age integer not null check (age >= 0 and age <= 120),
  university_id uuid references public.universities(id),
  verified_university boolean not null default false,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create table if not exists public.interests (
  id uuid primary key default gen_random_uuid(),
  name text not null unique check (name ~ '^#[a-z0-9_]+$'),
  subscriber_count integer not null default 0 check (subscriber_count >= 0),
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.user_interests (
  user_id uuid not null references public.profiles(id) on delete cascade,
  interest_id uuid not null references public.interests(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, interest_id)
);

create table if not exists public.user_locations (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  university_id uuid references public.universities(id),
  campus_zone text not null,
  fuzzy_latitude numeric(9, 6),
  fuzzy_longitude numeric(9, 6),
  radius_meters integer not null default 500 check (radius_meters between 50 and 5000),
  is_visible boolean not null default true,
  last_active_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists user_locations_set_updated_at on public.user_locations;
create trigger user_locations_set_updated_at
before update on public.user_locations
for each row execute function public.set_updated_at();

create table if not exists public.friendships (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references public.profiles(id) on delete cascade,
  addressee_id uuid not null references public.profiles(id) on delete cascade,
  status public.friendship_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (requester_id <> addressee_id),
  unique (requester_id, addressee_id)
);

drop trigger if exists friendships_set_updated_at on public.friendships;
create trigger friendships_set_updated_at
before update on public.friendships
for each row execute function public.set_updated_at();

create table if not exists public.communities (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(trim(name)) > 0),
  description text,
  interest_id uuid references public.interests(id) on delete set null,
  university_id uuid references public.universities(id),
  privacy public.community_privacy not null default 'public',
  lead_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists communities_set_updated_at on public.communities;
create trigger communities_set_updated_at
before update on public.communities
for each row execute function public.set_updated_at();

create table if not exists public.community_members (
  community_id uuid not null references public.communities(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role public.community_role not null default 'member',
  joined_at timestamptz not null default now(),
  primary key (community_id, user_id)
);

create table if not exists public.community_join_requests (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references public.communities(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'approved', 'denied')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (community_id, user_id)
);

drop trigger if exists community_join_requests_set_updated_at on public.community_join_requests;
create trigger community_join_requests_set_updated_at
before update on public.community_join_requests
for each row execute function public.set_updated_at();

create table if not exists public.community_events (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references public.communities(id) on delete cascade,
  title text not null,
  description text,
  starts_at timestamptz not null,
  location_label text not null,
  created_by uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.event_attendance (
  event_id uuid not null references public.community_events(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  status public.attendance_status not null default 'interested',
  updated_at timestamptz not null default now(),
  primary key (event_id, user_id)
);

create table if not exists public.chats (
  id uuid primary key default gen_random_uuid(),
  kind public.chat_kind not null,
  title text not null,
  community_id uuid references public.communities(id) on delete cascade,
  campus_zone text,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.chat_participants (
  chat_id uuid not null references public.chats(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  pinned boolean not null default false,
  joined_at timestamptz not null default now(),
  primary key (chat_id, user_id)
);

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  chat_id uuid not null references public.chats(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  content text not null check (length(trim(content)) > 0),
  flagged boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.blocks (
  blocker_id uuid not null references public.profiles(id) on delete cascade,
  blocked_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  check (blocker_id <> blocked_id),
  primary key (blocker_id, blocked_id)
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  reported_user_id uuid references public.profiles(id) on delete set null,
  message_id uuid references public.chat_messages(id) on delete set null,
  reason text not null,
  status public.report_status not null default 'open',
  created_at timestamptz not null default now()
);

create index if not exists profiles_university_id_idx on public.profiles(university_id);
create index if not exists interests_name_idx on public.interests(name);
create index if not exists user_locations_university_zone_idx on public.user_locations(university_id, campus_zone);
create index if not exists friendships_requester_idx on public.friendships(requester_id);
create index if not exists friendships_addressee_idx on public.friendships(addressee_id);
create index if not exists chat_messages_chat_created_idx on public.chat_messages(chat_id, created_at);
create index if not exists blocks_blocked_idx on public.blocks(blocked_id);

insert into public.universities (name, short_name, email_domain)
values
  ('UC Berkeley', 'UC Berkeley', 'berkeley.edu'),
  ('UC Davis', 'UC Davis', 'ucdavis.edu'),
  ('UC Irvine', 'UCI', 'uci.edu'),
  ('UCLA', 'UCLA', 'ucla.edu'),
  ('UC Merced', 'UC Merced', 'ucmerced.edu'),
  ('UC Riverside', 'UCR', 'ucr.edu'),
  ('UC San Diego', 'UCSD', 'ucsd.edu'),
  ('UC San Francisco', 'UCSF', 'ucsf.edu'),
  ('UC Santa Barbara', 'UCSB', 'ucsb.edu'),
  ('UC Santa Cruz', 'UCSC', 'ucsc.edu'),
  ('Cal State Fullerton', 'CSUF', 'fullerton.edu'),
  ('San Diego State', 'SDSU', 'sdsu.edu'),
  ('San Jose State', 'SJSU', 'sjsu.edu')
on conflict (name) do nothing;

alter table public.universities enable row level security;
alter table public.profiles enable row level security;
alter table public.interests enable row level security;
alter table public.user_interests enable row level security;
alter table public.user_locations enable row level security;
alter table public.friendships enable row level security;
alter table public.communities enable row level security;
alter table public.community_members enable row level security;
alter table public.community_join_requests enable row level security;
alter table public.community_events enable row level security;
alter table public.event_attendance enable row level security;
alter table public.chats enable row level security;
alter table public.chat_participants enable row level security;
alter table public.chat_messages enable row level security;
alter table public.blocks enable row level security;
alter table public.reports enable row level security;

drop policy if exists "universities are readable" on public.universities;
create policy "universities are readable"
on public.universities for select
to anon, authenticated
using (true);

drop policy if exists "profiles are readable by signed in users" on public.profiles;
create policy "profiles are readable by signed in users"
on public.profiles for select
to authenticated
using (true);

drop policy if exists "users insert own profile" on public.profiles;
create policy "users insert own profile"
on public.profiles for insert
to authenticated
with check (auth.uid() = id);

drop policy if exists "users update own profile" on public.profiles;
create policy "users update own profile"
on public.profiles for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "interests are readable" on public.interests;
create policy "interests are readable"
on public.interests for select
to authenticated
using (true);

drop policy if exists "users create interests" on public.interests;
create policy "users create interests"
on public.interests for insert
to authenticated
with check (created_by is null or created_by = auth.uid());

drop policy if exists "users read own interests" on public.user_interests;
create policy "users read own interests"
on public.user_interests for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "users manage own interests" on public.user_interests;
create policy "users manage own interests"
on public.user_interests for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "visible locations are readable" on public.user_locations;
create policy "visible locations are readable"
on public.user_locations for select
to authenticated
using (is_visible);

drop policy if exists "users manage own location" on public.user_locations;
create policy "users manage own location"
on public.user_locations for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "users read their friendships" on public.friendships;
create policy "users read their friendships"
on public.friendships for select
to authenticated
using (auth.uid() in (requester_id, addressee_id));

drop policy if exists "users create friend requests" on public.friendships;
create policy "users create friend requests"
on public.friendships for insert
to authenticated
with check (auth.uid() = requester_id);

drop policy if exists "users update their friendships" on public.friendships;
create policy "users update their friendships"
on public.friendships for update
to authenticated
using (auth.uid() in (requester_id, addressee_id))
with check (auth.uid() in (requester_id, addressee_id));

drop policy if exists "communities are readable" on public.communities;
create policy "communities are readable"
on public.communities for select
to authenticated
using (true);

drop policy if exists "users create communities" on public.communities;
create policy "users create communities"
on public.communities for insert
to authenticated
with check (auth.uid() = lead_id);

drop policy if exists "leads update communities" on public.communities;
create policy "leads update communities"
on public.communities for update
to authenticated
using (auth.uid() = lead_id)
with check (auth.uid() = lead_id);

drop policy if exists "community members readable" on public.community_members;
create policy "community members readable"
on public.community_members for select
to authenticated
using (true);

drop policy if exists "users join public communities" on public.community_members;
create policy "users join public communities"
on public.community_members for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "users read own join requests" on public.community_join_requests;
create policy "users read own join requests"
on public.community_join_requests for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "users create own join requests" on public.community_join_requests;
create policy "users create own join requests"
on public.community_join_requests for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "community events readable" on public.community_events;
create policy "community events readable"
on public.community_events for select
to authenticated
using (true);

drop policy if exists "leads create community events" on public.community_events;
create policy "leads create community events"
on public.community_events for insert
to authenticated
with check (auth.uid() = created_by);

drop policy if exists "users manage own attendance" on public.event_attendance;
create policy "users manage own attendance"
on public.event_attendance for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "participants read chats" on public.chats;
create policy "participants read chats"
on public.chats for select
to authenticated
using (
  exists (
    select 1 from public.chat_participants cp
    where cp.chat_id = chats.id and cp.user_id = auth.uid()
  )
);

drop policy if exists "participants read participants" on public.chat_participants;
create policy "participants read participants"
on public.chat_participants for select
to authenticated
using (
  exists (
    select 1 from public.chat_participants own_cp
    where own_cp.chat_id = chat_participants.chat_id and own_cp.user_id = auth.uid()
  )
);

drop policy if exists "users manage own chat participant row" on public.chat_participants;
create policy "users manage own chat participant row"
on public.chat_participants for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "participants read messages" on public.chat_messages;
create policy "participants read messages"
on public.chat_messages for select
to authenticated
using (
  exists (
    select 1 from public.chat_participants cp
    where cp.chat_id = chat_messages.chat_id and cp.user_id = auth.uid()
  )
);

drop policy if exists "participants send messages" on public.chat_messages;
create policy "participants send messages"
on public.chat_messages for insert
to authenticated
with check (
  auth.uid() = sender_id
  and exists (
    select 1 from public.chat_participants cp
    where cp.chat_id = chat_messages.chat_id and cp.user_id = auth.uid()
  )
);

drop policy if exists "users manage own blocks" on public.blocks;
create policy "users manage own blocks"
on public.blocks for all
to authenticated
using (auth.uid() = blocker_id)
with check (auth.uid() = blocker_id);

drop policy if exists "users create reports" on public.reports;
create policy "users create reports"
on public.reports for insert
to authenticated
with check (auth.uid() = reporter_id);

drop policy if exists "users read own reports" on public.reports;
create policy "users read own reports"
on public.reports for select
to authenticated
using (auth.uid() = reporter_id);
