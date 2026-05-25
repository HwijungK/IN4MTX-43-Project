-- CommonGround demo data seed.
-- Run this after supabase/schema.sql in Supabase Dashboard -> SQL Editor.
-- It replaces app-side hardcoded mock rows with database-backed demo rows.

create extension if not exists pgcrypto;

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
on conflict (name) do update
set short_name = excluded.short_name,
    email_domain = excluded.email_domain;

drop policy if exists "universities are readable" on public.universities;
create policy "universities are readable"
on public.universities for select
to anon, authenticated
using (true);

drop policy if exists "interests are readable" on public.interests;
create policy "interests are readable"
on public.interests for select
to anon, authenticated
using (true);

insert into public.interests (name, subscriber_count)
values
  ('#climbing', 1280),
  ('#coffee', 932),
  ('#photography', 870),
  ('#boardgames', 542),
  ('#running', 1470),
  ('#film', 613)
on conflict (name) do update
set subscriber_count = excluded.subscriber_count;

insert into auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
)
values
  ('11111111-1111-4111-8111-111111111111', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'alex.demo@uci.edu', crypt('demo-password', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('22222222-2222-4222-8222-222222222222', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'maya.demo@uci.edu', crypt('demo-password', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('33333333-3333-4333-8333-333333333333', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'jordan.demo@uci.edu', crypt('demo-password', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('44444444-4444-4444-8444-444444444444', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'nina.demo@uci.edu', crypt('demo-password', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('55555555-5555-4555-8555-555555555555', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'sam.demo@ucla.edu', crypt('demo-password', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('66666666-6666-4666-8666-666666666666', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'lena.demo@ucsd.edu', crypt('demo-password', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('77777777-7777-4777-8777-777777777777', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'omar.demo@uci.edu', crypt('demo-password', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', '')
on conflict (id) do update
set email = excluded.email,
    updated_at = now();

insert into public.profiles (id, display_name, bio, identity_group, age, university_id, verified_university)
values
  ('11111111-1111-4111-8111-111111111111', 'Alex', 'Trying new hobbies and making campus friends.', 'university_student', 21, (select id from public.universities where name = 'UC Irvine'), true),
  ('22222222-2222-4222-8222-222222222222', 'Maya', 'Looking for a cafe study break', 'university_student', 21, (select id from public.universities where name = 'UC Irvine'), true),
  ('33333333-3333-4333-8333-333333333333', 'Jordan', 'Training for a campus 10k this month', 'university_student', 22, (select id from public.universities where name = 'UC Irvine'), true),
  ('44444444-4444-4444-8444-444444444444', 'Nina', 'Finding people for a movie night', 'university_student', 20, (select id from public.universities where name = 'UC Irvine'), true),
  ('55555555-5555-4555-8555-555555555555', 'Sam', 'Always down for strategy games after class', 'university_student', 19, (select id from public.universities where name = 'UCLA'), true),
  ('66666666-6666-4666-8666-666666666666', 'Lena', 'Looking for people to explore new photo spots', 'university_student', 22, (select id from public.universities where name = 'UC San Diego'), true),
  ('77777777-7777-4777-8777-777777777777', 'Omar', 'Coffee walks between project sessions', 'university_student', 24, (select id from public.universities where name = 'UC Irvine'), true)
on conflict (id) do update
set display_name = excluded.display_name,
    bio = excluded.bio,
    identity_group = excluded.identity_group,
    age = excluded.age,
    university_id = excluded.university_id,
    verified_university = excluded.verified_university;

create table if not exists public.demo_profile_cards (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  user_key text not null unique,
  distance_label text not null,
  campus_status text not null,
  friend_score integer not null check (friend_score between 0 and 100)
);

insert into public.demo_profile_cards (profile_id, user_key, distance_label, campus_status, friend_score)
values
  ('22222222-2222-4222-8222-222222222222', 'maya', '0.2 mi', 'Looking for a cafe study break', 92),
  ('33333333-3333-4333-8333-333333333333', 'jordan', '0.4 mi', 'Training for a campus 10k this month', 81),
  ('44444444-4444-4444-8444-444444444444', 'nina', '0.6 mi', 'Finding people for a movie night', 76),
  ('55555555-5555-4555-8555-555555555555', 'sam', '0.3 mi', 'Always down for strategy games after class', 88),
  ('66666666-6666-4666-8666-666666666666', 'lena', '0.5 mi', 'Looking for people to explore new photo spots', 84),
  ('77777777-7777-4777-8777-777777777777', 'omar', '0.8 mi', 'Coffee walks between project sessions', 79)
on conflict (profile_id) do update
set user_key = excluded.user_key,
    distance_label = excluded.distance_label,
    campus_status = excluded.campus_status,
    friend_score = excluded.friend_score;

insert into public.user_locations (user_id, university_id, campus_zone, fuzzy_latitude, fuzzy_longitude, radius_meters, is_visible, last_active_at)
values
  ('22222222-2222-4222-8222-222222222222', (select id from public.universities where name = 'UC Irvine'), 'Aldrich Park', 33.646000, -117.842700, 500, true, now()),
  ('33333333-3333-4333-8333-333333333333', (select id from public.universities where name = 'UC Irvine'), 'ARC', 33.643300, -117.827500, 500, true, now()),
  ('44444444-4444-4444-8444-444444444444', (select id from public.universities where name = 'UC Irvine'), 'Student Center', 33.648500, -117.842100, 500, true, now()),
  ('55555555-5555-4555-8555-555555555555', (select id from public.universities where name = 'UCLA'), 'Bruin Plaza', 34.070300, -118.444100, 500, true, now()),
  ('66666666-6666-4666-8666-666666666666', (select id from public.universities where name = 'UC San Diego'), 'Price Center', 32.879600, -117.236200, 500, true, now()),
  ('77777777-7777-4777-8777-777777777777', (select id from public.universities where name = 'UC Irvine'), 'Engineering Quad', 33.644500, -117.841200, 500, true, now())
on conflict (user_id) do update
set university_id = excluded.university_id,
    campus_zone = excluded.campus_zone,
    fuzzy_latitude = excluded.fuzzy_latitude,
    fuzzy_longitude = excluded.fuzzy_longitude,
    radius_meters = excluded.radius_meters,
    is_visible = excluded.is_visible,
    last_active_at = excluded.last_active_at;

insert into public.user_interests (user_id, interest_id)
select demo.user_id, i.id
from (
  values
    ('11111111-1111-4111-8111-111111111111'::uuid, '#coffee'),
    ('11111111-1111-4111-8111-111111111111'::uuid, '#photography'),
    ('22222222-2222-4222-8222-222222222222'::uuid, '#climbing'),
    ('22222222-2222-4222-8222-222222222222'::uuid, '#coffee'),
    ('22222222-2222-4222-8222-222222222222'::uuid, '#photography'),
    ('33333333-3333-4333-8333-333333333333'::uuid, '#running'),
    ('33333333-3333-4333-8333-333333333333'::uuid, '#boardgames'),
    ('44444444-4444-4444-8444-444444444444'::uuid, '#film'),
    ('44444444-4444-4444-8444-444444444444'::uuid, '#photography'),
    ('44444444-4444-4444-8444-444444444444'::uuid, '#coffee'),
    ('55555555-5555-4555-8555-555555555555'::uuid, '#boardgames'),
    ('55555555-5555-4555-8555-555555555555'::uuid, '#film'),
    ('55555555-5555-4555-8555-555555555555'::uuid, '#coffee'),
    ('66666666-6666-4666-8666-666666666666'::uuid, '#photography'),
    ('66666666-6666-4666-8666-666666666666'::uuid, '#running'),
    ('77777777-7777-4777-8777-777777777777'::uuid, '#coffee'),
    ('77777777-7777-4777-8777-777777777777'::uuid, '#running'),
    ('77777777-7777-4777-8777-777777777777'::uuid, '#climbing')
) as demo(user_id, interest_name)
join public.interests i on i.name = demo.interest_name
on conflict (user_id, interest_id) do nothing;

create table if not exists public.demo_interest_cards (
  interest_id uuid primary key references public.interests(id) on delete cascade,
  active_nearby integer not null check (active_nearby >= 0)
);

insert into public.demo_interest_cards (interest_id, active_nearby)
select i.id, demo.active_nearby
from (
  values
    ('#climbing', 34),
    ('#coffee', 41),
    ('#photography', 18),
    ('#boardgames', 12),
    ('#running', 52),
    ('#film', 16)
) as demo(interest_name, active_nearby)
join public.interests i on i.name = demo.interest_name
on conflict (interest_id) do update
set active_nearby = excluded.active_nearby;

insert into public.friendships (requester_id, addressee_id, status)
values
  ('11111111-1111-4111-8111-111111111111', '22222222-2222-4222-8222-222222222222', 'accepted'),
  ('11111111-1111-4111-8111-111111111111', '33333333-3333-4333-8333-333333333333', 'accepted'),
  ('11111111-1111-4111-8111-111111111111', '44444444-4444-4444-8444-444444444444', 'accepted')
on conflict (requester_id, addressee_id) do update
set status = excluded.status;

create table if not exists public.demo_nearby_groups (
  group_key text primary key,
  name text not null,
  campus_zone text not null,
  interest_id uuid references public.interests(id) on delete set null,
  people_here integer not null check (people_here >= 0),
  note text not null
);

insert into public.demo_nearby_groups (group_key, name, campus_zone, interest_id, people_here, note)
values
  ('study-lawn', 'Study lawn cluster', 'Aldrich Park', (select id from public.interests where name = '#coffee'), 8, 'Loose group studying before evening classes'),
  ('arc-run', 'ARC running meetup', 'ARC', (select id from public.interests where name = '#running'), 11, 'Informal warmup group near the track')
on conflict (group_key) do update
set name = excluded.name,
    campus_zone = excluded.campus_zone,
    interest_id = excluded.interest_id,
    people_here = excluded.people_here,
    note = excluded.note;

insert into public.communities (id, name, description, interest_id, university_id, privacy, lead_id)
values
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 'Campus Trail Runners', 'Informal easy pace loop this Friday.', (select id from public.interests where name = '#running'), (select id from public.universities where name = 'UC Irvine'), 'public', '33333333-3333-4333-8333-333333333333'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2', 'Beginner Climbers', 'Student-led gear check and belay basics.', (select id from public.interests where name = '#climbing'), (select id from public.universities where name = 'UC Irvine'), 'request', '22222222-2222-4222-8222-222222222222'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa3', 'Third Place Coffee', 'Unofficial study table reservation thread.', (select id from public.interests where name = '#coffee'), (select id from public.universities where name = 'UC Irvine'), 'public', '77777777-7777-4777-8777-777777777777')
on conflict (id) do update
set name = excluded.name,
    description = excluded.description,
    interest_id = excluded.interest_id,
    university_id = excluded.university_id,
    privacy = excluded.privacy,
    lead_id = excluded.lead_id;

create table if not exists public.demo_community_cards (
  community_id uuid primary key references public.communities(id) on delete cascade,
  community_key text not null unique,
  distance_label text not null,
  member_count integer not null check (member_count >= 0),
  event_label text not null
);

insert into public.demo_community_cards (community_id, community_key, distance_label, member_count, event_label)
values
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 'trail-runners', '0.3 mi', 212, 'Friday 5:30 PM'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2', 'beginner-climbers', '1.1 mi', 87, 'Saturday 10:00 AM'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa3', 'third-place', '0.5 mi', 154, 'Today 2:00 PM')
on conflict (community_id) do update
set community_key = excluded.community_key,
    distance_label = excluded.distance_label,
    member_count = excluded.member_count,
    event_label = excluded.event_label;

insert into public.community_members (community_id, user_id, role)
values
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1', '33333333-3333-4333-8333-333333333333', 'lead'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2', '22222222-2222-4222-8222-222222222222', 'lead'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa3', '77777777-7777-4777-8777-777777777777', 'lead'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa3', '11111111-1111-4111-8111-111111111111', 'member')
on conflict (community_id, user_id) do update
set role = excluded.role;

insert into public.community_events (id, community_id, title, description, starts_at, location_label, created_by)
values
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 'Easy pace loop', 'Informal easy pace loop this Friday.', '2026-05-29 17:30:00-07', 'ARC trailhead', '33333333-3333-4333-8333-333333333333'),
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2', 'Gear check and belay basics', 'Student-led gear check and belay basics.', '2026-05-30 10:00:00-07', 'Climbing wall', '22222222-2222-4222-8222-222222222222'),
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb3', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa3', 'Study table reservation', 'Unofficial study table reservation thread.', '2026-05-25 14:00:00-07', 'Third Place Coffee', '77777777-7777-4777-8777-777777777777')
on conflict (id) do update
set title = excluded.title,
    description = excluded.description,
    starts_at = excluded.starts_at,
    location_label = excluded.location_label,
    created_by = excluded.created_by;

insert into public.chats (id, kind, title, community_id, campus_zone, expires_at)
values
  ('cccccccc-cccc-4ccc-8ccc-ccccccccccc1', 'proximity', 'Aldrich Park campus chat', null, 'Aldrich Park', now() + interval '6 hours'),
  ('cccccccc-cccc-4ccc-8ccc-ccccccccccc2', 'friend', 'Maya', null, null, null),
  ('cccccccc-cccc-4ccc-8ccc-ccccccccccc3', 'community', 'Photo Walk', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa3', null, null)
on conflict (id) do update
set kind = excluded.kind,
    title = excluded.title,
    community_id = excluded.community_id,
    campus_zone = excluded.campus_zone,
    expires_at = excluded.expires_at;

create table if not exists public.demo_chat_cards (
  chat_id uuid primary key references public.chats(id) on delete cascade,
  chat_key text not null unique,
  preview text not null,
  participant_count integer not null check (participant_count >= 0),
  expires_label text
);

insert into public.demo_chat_cards (chat_id, chat_key, preview, participant_count, expires_label)
values
  ('cccccccc-cccc-4ccc-8ccc-ccccccccccc1', 'nearby', 'Anyone heading to the outdoor movie later?', 14, 'Campus chat dissolves unless you become friends'),
  ('cccccccc-cccc-4ccc-8ccc-ccccccccccc2', 'maya', 'Want to meet by the coffee cart at 3?', 2, null),
  ('cccccccc-cccc-4ccc-8ccc-ccccccccccc3', 'photo-walk', 'Meetup route posted for Saturday morning.', 38, null)
on conflict (chat_id) do update
set chat_key = excluded.chat_key,
    preview = excluded.preview,
    participant_count = excluded.participant_count,
    expires_label = excluded.expires_label;

insert into public.chat_participants (chat_id, user_id, pinned)
values
  ('cccccccc-cccc-4ccc-8ccc-ccccccccccc1', '11111111-1111-4111-8111-111111111111', false),
  ('cccccccc-cccc-4ccc-8ccc-ccccccccccc1', '22222222-2222-4222-8222-222222222222', false),
  ('cccccccc-cccc-4ccc-8ccc-ccccccccccc1', '33333333-3333-4333-8333-333333333333', false),
  ('cccccccc-cccc-4ccc-8ccc-ccccccccccc2', '11111111-1111-4111-8111-111111111111', true),
  ('cccccccc-cccc-4ccc-8ccc-ccccccccccc2', '22222222-2222-4222-8222-222222222222', false),
  ('cccccccc-cccc-4ccc-8ccc-ccccccccccc3', '11111111-1111-4111-8111-111111111111', false),
  ('cccccccc-cccc-4ccc-8ccc-ccccccccccc3', '44444444-4444-4444-8444-444444444444', false)
on conflict (chat_id, user_id) do update
set pinned = excluded.pinned;

insert into public.chat_messages (id, chat_id, sender_id, content, created_at)
values
  ('dddddddd-dddd-4ddd-8ddd-ddddddddddd1', 'cccccccc-cccc-4ccc-8ccc-ccccccccccc1', '22222222-2222-4222-8222-222222222222', 'Anyone heading to the outdoor movie later?', '2026-05-25 14:14:00-07'),
  ('dddddddd-dddd-4ddd-8ddd-ddddddddddd2', 'cccccccc-cccc-4ccc-8ccc-ccccccccccc1', '11111111-1111-4111-8111-111111111111', 'I might. Is the group meeting near the flagpoles?', '2026-05-25 14:16:00-07'),
  ('dddddddd-dddd-4ddd-8ddd-ddddddddddd3', 'cccccccc-cccc-4ccc-8ccc-ccccccccccc1', '33333333-3333-4333-8333-333333333333', 'Yep, a few of us are grabbing coffee first.', '2026-05-25 14:18:00-07'),
  ('dddddddd-dddd-4ddd-8ddd-ddddddddddd4', 'cccccccc-cccc-4ccc-8ccc-ccccccccccc2', '22222222-2222-4222-8222-222222222222', 'Want to meet by the coffee cart at 3?', '2026-05-25 13:42:00-07'),
  ('dddddddd-dddd-4ddd-8ddd-ddddddddddd5', 'cccccccc-cccc-4ccc-8ccc-ccccccccccc2', '11111111-1111-4111-8111-111111111111', 'That works. I will bring my camera too.', '2026-05-25 13:47:00-07'),
  ('dddddddd-dddd-4ddd-8ddd-ddddddddddd6', 'cccccccc-cccc-4ccc-8ccc-ccccccccccc3', '44444444-4444-4444-8444-444444444444', 'Meetup route posted for Saturday morning.', '2026-05-24 10:00:00-07'),
  ('dddddddd-dddd-4ddd-8ddd-ddddddddddd7', 'cccccccc-cccc-4ccc-8ccc-ccccccccccc3', '11111111-1111-4111-8111-111111111111', 'I can join for the first half.', '2026-05-24 10:05:00-07')
on conflict (id) do update
set chat_id = excluded.chat_id,
    sender_id = excluded.sender_id,
    content = excluded.content,
    created_at = excluded.created_at;

create table if not exists public.demo_chat_message_cards (
  message_id uuid primary key references public.chat_messages(id) on delete cascade,
  message_key text not null unique,
  time_label text not null,
  is_mine boolean not null default false
);

insert into public.demo_chat_message_cards (message_id, message_key, time_label, is_mine)
values
  ('dddddddd-dddd-4ddd-8ddd-ddddddddddd1', 'nearby-1', '2:14 PM', false),
  ('dddddddd-dddd-4ddd-8ddd-ddddddddddd2', 'nearby-2', '2:16 PM', true),
  ('dddddddd-dddd-4ddd-8ddd-ddddddddddd3', 'nearby-3', '2:18 PM', false),
  ('dddddddd-dddd-4ddd-8ddd-ddddddddddd4', 'maya-1', '1:42 PM', false),
  ('dddddddd-dddd-4ddd-8ddd-ddddddddddd5', 'maya-2', '1:47 PM', true),
  ('dddddddd-dddd-4ddd-8ddd-ddddddddddd6', 'photo-walk-1', 'Yesterday', false),
  ('dddddddd-dddd-4ddd-8ddd-ddddddddddd7', 'photo-walk-2', 'Yesterday', true)
on conflict (message_id) do update
set message_key = excluded.message_key,
    time_label = excluded.time_label,
    is_mine = excluded.is_mine;

drop view if exists public.demo_interest_rows;
create view public.demo_interest_rows as
select
  i.id::text as id,
  i.name as label,
  i.subscriber_count as subscribers,
  coalesce(dic.active_nearby, 0) as active_nearby
from public.interests i
left join public.demo_interest_cards dic on dic.interest_id = i.id;

drop view if exists public.demo_nearby_user_rows;
create view public.demo_nearby_user_rows as
select
  dpc.user_key as id,
  p.id::text as profile_id,
  p.display_name as name,
  p.age,
  dpc.distance_label as distance,
  case p.identity_group
    when 'child' then 'Child'
    when 'adult' then 'Adult'
    else 'University student'
  end as identity,
  u.name as university,
  ul.campus_zone,
  coalesce(array_agg(i.name order by i.name) filter (where i.name is not null), array[]::text[]) as interests,
  dpc.campus_status as status,
  dpc.friend_score
from public.demo_profile_cards dpc
join public.profiles p on p.id = dpc.profile_id
left join public.universities u on u.id = p.university_id
left join public.user_locations ul on ul.user_id = p.id
left join public.user_interests ui on ui.user_id = p.id
left join public.interests i on i.id = ui.interest_id
group by dpc.user_key, p.display_name, p.age, p.identity_group, u.name, ul.campus_zone, dpc.distance_label, dpc.campus_status, dpc.friend_score;

drop view if exists public.demo_friend_rows;
create view public.demo_friend_rows as
select dpc.user_key as user_id
from public.friendships f
join public.demo_profile_cards dpc on dpc.profile_id = f.addressee_id
where f.requester_id = '11111111-1111-4111-8111-111111111111'
  and f.status = 'accepted';

drop view if exists public.demo_selected_tag_rows;
create view public.demo_selected_tag_rows as
select i.name as label
from public.user_interests ui
join public.interests i on i.id = ui.interest_id
where ui.user_id = '11111111-1111-4111-8111-111111111111'
order by i.name;

drop view if exists public.demo_nearby_group_rows;
create view public.demo_nearby_group_rows as
select
  dng.group_key as id,
  dng.name,
  dng.campus_zone,
  coalesce(i.name, '#campus') as interest,
  dng.people_here,
  dng.note
from public.demo_nearby_groups dng
left join public.interests i on i.id = dng.interest_id;

drop view if exists public.demo_chat_rows;
create view public.demo_chat_rows as
select
  dcc.chat_key as id,
  c.title,
  case c.kind
    when 'proximity' then 'Proximity'
    when 'friend' then 'Friends'
    else 'Community'
  end as kind,
  dcc.preview,
  dcc.participant_count as participants,
  dcc.expires_label as expires
from public.demo_chat_cards dcc
join public.chats c on c.id = dcc.chat_id;

drop view if exists public.demo_chat_message_rows;
create view public.demo_chat_message_rows as
select
  dcmc.message_key as id,
  dcc.chat_key as chat_id,
  case when dcmc.is_mine then 'You' else p.display_name end as sender,
  cm.content,
  dcmc.time_label as time,
  dcmc.is_mine
from public.demo_chat_message_cards dcmc
join public.chat_messages cm on cm.id = dcmc.message_id
join public.demo_chat_cards dcc on dcc.chat_id = cm.chat_id
join public.profiles p on p.id = cm.sender_id;

drop view if exists public.demo_community_rows;
create view public.demo_community_rows as
select
  dcc.community_key as id,
  c.id::text as community_id,
  c.name,
  coalesce(i.name, '#campus') as tag,
  dcc.distance_label as distance,
  dcc.member_count as members,
  case c.privacy
    when 'request' then 'Request'
    else 'Public'
  end as privacy,
  coalesce(c.description, '') as announcement,
  dcc.event_label as event
from public.demo_community_cards dcc
join public.communities c on c.id = dcc.community_id
left join public.interests i on i.id = c.interest_id;

drop view if exists public.demo_joined_community_rows;
create view public.demo_joined_community_rows as
select dcc.community_key as community_id
from public.community_members cm
join public.demo_community_cards dcc on dcc.community_id = cm.community_id
where cm.user_id = '11111111-1111-4111-8111-111111111111';

grant select on
  public.demo_interest_rows,
  public.demo_nearby_user_rows,
  public.demo_friend_rows,
  public.demo_selected_tag_rows,
  public.demo_nearby_group_rows,
  public.demo_chat_rows,
  public.demo_chat_message_rows,
  public.demo_community_rows,
  public.demo_joined_community_rows
to anon, authenticated;
