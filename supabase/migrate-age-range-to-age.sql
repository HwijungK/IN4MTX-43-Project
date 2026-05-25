-- Run this if your Supabase project was created with the old profiles.age_range column.
-- Supabase Dashboard -> SQL Editor -> New query

alter table public.profiles
add column if not exists age integer;

update public.profiles
set age = nullif(regexp_replace(age_range, '[^0-9]', '', 'g'), '')::integer
where age is null
  and age_range is not null;

alter table public.profiles
alter column age set not null;

alter table public.profiles
add constraint profiles_age_check check (age >= 0 and age <= 120);

alter table public.profiles
drop column if exists age_range;
