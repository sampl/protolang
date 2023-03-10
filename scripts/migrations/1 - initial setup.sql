-- Start transaction
BEGIN;

-------------------------------------------------
-----------------     TABLES    -----------------
-------------------------------------------------

-----------------   Users   -----------------

create table user_settings (
  id                uuid references auth.users(id) primary key,

  preferences       jsonb,
  onboarding_flags  jsonb,

  created_at        timestamptz default now() not null,
  updated_at        timestamptz default now() not null,
  created_by        uuid not null references auth.users(id)
);

-- TODO - this reference is weird. maybe this should not be referencing the auth uuid
create type user_role_types as enum ('admin', 'editor', 'viewer');
create table user_roles (
  id                uuid references auth.users(id) primary key,

  -- admins can add and edit other users
  -- editors can add and edit lessons
  -- viewers - default, no edit access, only for demoting people
  role_type         user_role_types not null,

  created_at        timestamptz default now() not null,
  updated_at        timestamptz default now() not null,
  created_by        uuid not null references auth.users(id)
);

create table profiles (
  id            uuid references auth.users(id) primary key,

  username      text unique,
  full_name     text,
  bio           text,
  avatar_url    text,

  created_at    timestamptz default now() not null,
  updated_at    timestamptz default now() not null,
  created_by    uuid not null references auth.users(id)
);

create table profile_follows (
  profile_id        uuid references profiles(id) not null,

  created_at        timestamptz default now() not null,
  updated_at        timestamptz default now() not null,
  created_by        uuid not null references auth.users(id),

  primary key(created_by, profile_id)
);

----------------- Languages -----------------

-- TODO - use bigint or uuid for id instead of country code (id cannot change)
create table languages (
  id          text primary key,

  name_eng     text unique not null,
  flag        text unique not null,
  is_beta     boolean default false not null,
  is_live     boolean default false not null,

  created_at  timestamptz default now() not null,
  updated_at  timestamptz default now() not null
);

create table language_votes (
  language_id   text not null references languages(id),
  is_upvoted    boolean not null,

  created_at    timestamptz default now() not null,
  updated_at    timestamptz default now() not null,
  created_by    uuid not null references auth.users(id),

  primary key(created_by, language_id)
);

create table user_languages (
  id                  bigint primary key generated always as identity,

  language_id         text not null references languages(id),
  preferences         jsonb,

  created_at          timestamptz default now() not null,
  updated_at          timestamptz default now() not null,
  created_by          uuid not null references auth.users(id)
);

-----------------   Topics   -----------------

create table topics (
  id                  bigint primary key generated always as identity,
  slug                text unique not null,

  title_eng           text unique not null,
  description_eng     text not null,
  user_selectable     boolean default false not null,

  created_at          timestamptz default now() not null,
  updated_at          timestamptz default now() not null,
  created_by          uuid not null references auth.users(id)
);

-----------------   Phrases   -----------------

create table phrases (
  id                    bigint primary key generated always as identity,

  language_id           text not null references languages(id),
  content_ita           text not null,
  content_eng           text not null,
  content_eng_alts      text[],
  content_ita_alts      text[],
  original_source_desc  text,
  original_source_url   text,

  created_at            timestamptz default now() not null,
  updated_at            timestamptz default now() not null,
  created_by            uuid not null references auth.users(id)
);

create table phrase_issues (
  id            bigint primary key generated always as identity,

  language_id   text not null references languages(id),
  phrase_id     bigint not null references phrases(id),
  comment       text,
  is_resolved   boolean default false not null,

  created_at    timestamptz default now() not null,
  updated_at    timestamptz default now() not null,
  created_by    uuid not null references auth.users(id)
);

create table phrase_attempts (
  id              bigint primary key generated always as identity,

  language_id     text not null references languages(id),
  phrase          bigint not null references phrases(id),
  guess           text,
  direction       text,
  prompt_type     text not null,
  repeated_only   boolean,
  answer_type     text,
  is_correct      boolean,
  perfect_answer  boolean,
  with_hint       boolean,
  second_try      boolean,

  created_at    timestamptz default now() not null,
  updated_at    timestamptz default now() not null,
  created_by    uuid not null references auth.users(id)
);

-----------------   Chats   -----------------

create type chat_message_sender_types as enum ('user', 'robot');
create table chat_messages (
  id                bigint primary key generated always as identity,

  language_id       text not null references languages(id),
  content           text not null,
  sender_type       chat_message_sender_types not null,
  sender_id         uuid references auth.users(id),
  -- TODO - which AI generated the response

  created_at        timestamptz default now() not null,
  updated_at        timestamptz default now() not null,
  created_by        uuid not null references auth.users(id)
);

-----------------  Lessons  -----------------

create table lessons (
  id            bigint primary key generated always as identity,
  slug          text unique not null,

  language_id   text not null references languages(id),
  title_eng     text not null,
  title_ita     text,
  sort_order    bigint,
  unit          bigint not null,

  created_at    timestamptz default now() not null,
  updated_at    timestamptz default now() not null,
  created_by    uuid not null references auth.users(id)
);

create table lesson_edits (
  id                  bigint primary key generated always as identity,

  language_id         text not null references languages(id),
  lesson_id           bigint not null references lessons(id),
  content_eng         text not null,

  -- these arrays are just strings
  -- someday when postgres supports it, we should reference other tables with a FK
  -- or make a table called lesson_edit_phrases or something? seems like overkill
  -- https://stackoverflow.com/questions/41054507/postgresql-array-of-elements-that-each-are-a-foreign-key
  phrase_strings_ita  text[], -- literally the text of the phrase for now, but we should be referencing the ID someday?
  topics              text[],

  created_at          timestamptz default now() not null,
  updated_at          timestamptz default now() not null,
  created_by          uuid not null references auth.users(id)
);

-- not good apparently: https://stackoverflow.com/questions/10446641/in-sql-is-it-ok-for-two-tables-to-refer-to-each-other
-- also breaks our clear script, circular dependency
-- TODO - get rid of lessons entirely, and just have lesson_edits?
alter table lessons add column current_edit bigint references lesson_edits(id);

-----------------   Lists   -----------------

create table lists (
  id            bigint primary key generated always as identity,

  language_id   text not null references languages(id),
  title         text not null,

  created_at    timestamptz default now() not null,
  updated_at    timestamptz default now() not null,
  created_by    uuid not null references auth.users(id)
);

create table list_items (
  id            bigint primary key generated always as identity,

  language_id   text not null references languages(id),
  list_id       bigint not null references lists(id),
  word_string   bigint not null,
  sort_order    bigint,

  created_at    timestamptz default now() not null,
  updated_at    timestamptz default now() not null,
  created_by    uuid not null references auth.users(id)
);

-----------------   Media   -----------------

create type media_types as enum ('book', 'article', 'podcast', 'video', 'tv_show', 'film', 'other');
create table media (
  id          bigint primary key generated always as identity,

  language_id text not null references languages(id),
  url         text not null,
  media_type  media_types not null,
  _scraped_info jsonb,

  created_at  timestamptz default now() not null,
  updated_at  timestamptz default now() not null,
  created_by  uuid not null references auth.users(id)
);

create table media_votes (
  language_id   text not null references languages(id),
  media_id      bigint not null references media(id),
  is_upvoted    boolean not null,

  created_at    timestamptz default now() not null,
  updated_at    timestamptz default now() not null,
  created_by    uuid not null references auth.users(id),

  primary key(created_by, media_id)
);

----------------- Mnemonics -----------------

create table mnemonics (
  id                bigint primary key generated always as identity,

  language_id       text not null references languages(id),
  target_phrase     text not null,
  remember_method   text not null,

  created_at        timestamptz default now() not null,
  updated_at        timestamptz default now() not null,
  created_by        uuid not null references auth.users(id)
);

create table mnemonic_votes (
  language_id   text not null references languages(id),
  mnemonic_id   bigint not null references mnemonics(id),
  is_upvoted    boolean not null,

  created_at    timestamptz default now() not null,
  updated_at    timestamptz default now() not null,
  created_by    uuid not null references auth.users(id),

  primary key(created_by, mnemonic_id)
);

-----------------   Migrations    -----------------

create table migrations (
  -- migration script should create the ID since it should always match the ID in the migrations file
  id          bigint primary key,
  created_at  timestamptz default now() not null
);


-------------------------------------------------
--------------       FUNCTIONS      -------------
-------------------------------------------------

-- This trigger automatically creates a profile entry when a new user signs up via Supabase Auth.
-- https://supabase.com/docs/guides/auth/managing-user-data#using-triggers for more details.
-- TODO - this is broken, doesn't hurt but doesn't work
create function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url, created_by)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    new.id
  );
  return new;
end;
$$ language plpgsql security definer;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-------------------------------------------------
--------------  ROW-LEVEL-SECURITY  -------------
-------------------------------------------------

-- https://supabase.com/docs/guides/auth/row-level-security

-- Helper functions for policies
-- https://supabase.com/docs/guides/auth/row-level-security#policies-with-security-definer-functions
create or replace function user_is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists(
    select 1 from user_roles as ur
    where ur.id = auth.uid()
    and role_type = 'admin'
  )
$$;

-----------------   Users   -----------------

alter table user_settings enable row level security;
create policy "Users can view their own settings, or admins"   on user_settings for select using ( auth.uid() = id or user_is_admin() );
create policy "Users can add their own settings"               on user_settings for insert to authenticated with check (auth.uid() = id);
create policy "Users can update their own settings"            on user_settings for update using (auth.uid() = id);
create policy "Nobody can delete user settings"                on user_settings for delete using (false);

alter table user_roles enable row level security;
create policy "Users can view their own user role, or admins"    on user_roles for select using ( auth.uid() = id or user_is_admin() );
create policy "Only admins can add a user role"                  on user_roles for insert to authenticated with check ( user_is_admin() );
create policy "Only admins can update a user role"               on user_roles for update using ( user_is_admin() );
create policy "Nobody can delete a user role"                    on user_roles for delete using (false);

alter table profiles enable row level security;
create policy "Anyone can view a profile"            on profiles for select using (true);
create policy "Users can add their own profile"      on profiles for insert to authenticated with check (auth.uid() = created_by);
create policy "Users can update their own profile"   on profiles for update using (auth.uid() = created_by);
create policy "Nobody can delete a profile"          on profiles for delete using (false);

alter table profile_follows enable row level security;
create policy "Anyone can view a profile follow"            on profile_follows for select using (true);
create policy "Users can add their own profile follow"      on profile_follows for insert to authenticated with check (auth.uid() = created_by);
create policy "Users can update their own profile follow"   on profile_follows for update using (auth.uid() = created_by);
create policy "Users can delete their own profile follow"   on profile_follows for delete using (auth.uid() = created_by);

----------------- Languages -----------------

alter table languages enable row level security;
create policy "Anyone can view a language"    on languages for select using (true);
create policy "Nobody can add a language"     on languages for insert with check (false);
create policy "Nobody can update a language"  on languages for update using (false);
create policy "Nobody can delete a language"  on languages for delete using (false);

alter table language_votes enable row level security;
create policy "Anyone can view a language vote"            on language_votes for select using (true);
create policy "Users can add a language vote"              on language_votes for insert to authenticated with check (auth.uid() = created_by);
create policy "Users can update their own language vote"   on language_votes for update using (auth.uid() = created_by);
create policy "Users can delete their own language vote"   on language_votes for delete using (auth.uid() = created_by);

alter table user_languages enable row level security;
create policy "Users can view their own user language"  on user_languages for select using (auth.uid() = created_by);
create policy "Users can add their own user language"   on user_languages for insert to authenticated with check ((auth.uid() = created_by));
create policy "Users can update their user language"    on user_languages for update using (auth.uid() = created_by);
create policy "Nobody can delete a user language"       on user_languages for delete using (false);

-----------------   Topics   -----------------

alter table topics enable row level security;
create policy "Anyone can view a topic"           on topics for select using (true);
create policy "Nobody can add a topic"            on topics for insert with check (false);
create policy "Nobody can update a topic"         on topics for update using (false);
create policy "Nobody can delete a topic"         on topics for delete using (false);

-----------------   Phrases   -----------------

alter table phrases enable row level security;
create policy "Anyone can view a phrase"                      on phrases for select using (true);
create policy "Users can add a phrase"                        on phrases for insert to authenticated with check (auth.uid() = created_by);
create policy "Users can update their own phrase, or admins"  on phrases for update using ( auth.uid() = created_by or user_is_admin() );
create policy "Nobody can delete a phrase"                    on phrases for delete using (false);

alter table phrase_issues enable row level security;
create policy "Anyone can view a phrase issue"                      on phrase_issues for select using (true);
create policy "Users can add a phrase issue"                        on phrase_issues for insert to authenticated with check (auth.uid() = created_by);
create policy "Users can update their own phrase issue, or admins"  on phrase_issues for update using ( auth.uid() = created_by or user_is_admin() );
create policy "Nobody can delete a phrase issue"                    on phrase_issues for delete using (false);

alter table phrase_attempts enable row level security;
create policy "Users can view their own phrase attempt"   on phrase_attempts for select using (auth.uid() = created_by);
create policy "Users can add an phrase attempt"           on phrase_attempts for insert to authenticated with check (auth.uid() = created_by);
create policy "Nobody can update an phrase attempt"       on phrase_attempts for update using (false);
create policy "Nobody can delete an phrase attempt"       on phrase_attempts for delete using (false);

-----------------   Chats   -----------------

alter table chat_messages enable row level security;
create policy "Users can view their own chat message"   on chat_messages for select using (auth.uid() = created_by);
create policy "Users can add a chat message"            on chat_messages for insert to authenticated with check (auth.uid() = created_by);
create policy "Users can update their chat message"     on chat_messages for update using (auth.uid() = created_by);
create policy "Nobody can delete a chat message"        on chat_messages for delete using (false);

-----------------  Lessons  -----------------

alter table lessons enable row level security;
create policy "Anyone can view a lesson"      on lessons for select using (true);
create policy "Users can add a lesson"        on lessons for insert to authenticated with check (auth.uid() = created_by);
create policy "Admins can update lessons"     on lessons for update using ( user_is_admin() );
create policy "Nobody can delete a lesson"    on lessons for delete using (false);

alter table lesson_edits enable row level security;
create policy "Anyone can view a lesson edit"       on lesson_edits for select using (true);
create policy "Users can add a lesson edit"         on lesson_edits for insert to authenticated with check ( auth.uid() = created_by);
create policy "Nobody can update a lesson edit"     on lesson_edits for update using (false);
create policy "Nobody can delete a lesson edit"     on lesson_edits for delete using (false);

-----------------   Lists   -----------------

alter table lists enable row level security;
create policy "Users can view their own list"         on lists for select using (auth.uid() = created_by);
create policy "Users can add a list"                  on lists for insert to authenticated with check (auth.uid() = created_by);
create policy "Users can update their own list"       on lists for update using (auth.uid() = created_by);
create policy "Users can delete their own list"       on lists for delete using (auth.uid() = created_by);

alter table list_items enable row level security;
create policy "Users can view their own list item"            on list_items for select using (auth.uid() = created_by);
create policy "Users can add a list item if it's their list"  on list_items for insert to authenticated with check (auth.uid() = created_by);
create policy "Users can update their own list item"          on list_items for update using (auth.uid() = created_by);
create policy "Users can delete their own list item"          on list_items for delete using (auth.uid() = created_by);

-----------------   Media   -----------------

alter table media enable row level security;
create policy "Anyone can view a media item"            on media for select using (true);
create policy "Users can add a media item"              on media for insert to authenticated with check (auth.uid() = created_by);
create policy "Users can update their own media item"   on media for update using (auth.uid() = created_by or user_is_admin() );
create policy "Nobody can delete a media item"          on media for delete using (false);

alter table media_votes enable row level security;
create policy "Anyone can view a media vote"            on media_votes for select using (true);
create policy "Users can add a media vote"              on media_votes for insert to authenticated with check (auth.uid() = created_by);
create policy "Users can update their own media vote"   on media_votes for update using (auth.uid() = created_by);
create policy "Users can delete their own media vote"   on media_votes for delete using (auth.uid() = created_by);

----------------- Mnemonics -----------------

alter table mnemonics enable row level security;
create policy "Anyone can view a mnemonic"            on mnemonics for select using (true);
create policy "Users can add a mnemonic"              on mnemonics for insert to authenticated with check (auth.uid() = created_by);
create policy "Users can update their own mnemonic"   on mnemonics for update using (auth.uid() = created_by or user_is_admin() );
create policy "Nobody can delete a mnemonic"          on mnemonics for delete using (false);

alter table mnemonic_votes enable row level security;
create policy "Anyone can view a mnemonic vote"             on mnemonic_votes for select using (true);
create policy "Users can add a mnemonic vote"               on mnemonic_votes for insert to authenticated with check (auth.uid() = created_by);
create policy "Users can update their own mnemonic vote"    on mnemonic_votes for update using (auth.uid() = created_by);
create policy "Users can delete their own mnemonic vote"    on mnemonic_votes for delete using (auth.uid() = created_by);

-----------------   Migrations    -----------------

-- may or may not need this, better to be explicit
alter table migrations enable row level security;
create policy "Nobody can view a migration"             on migrations for select using (false);
create policy "Nobody can add a migration"              on migrations for insert with check (false);
create policy "Nobody can update a migration"           on migrations for update using (false);
create policy "Nobody can delete a migration"           on migrations for delete using (false);


-------------------------------------------------
-----------------   REAL-TIME   -----------------
-------------------------------------------------

create publication supabase_realtime with (publish = 'insert');
alter publication supabase_realtime add table chat_messages;

-------------------------------------------------
-----------------    TRIGGERS   -----------------
-------------------------------------------------

create extension if not exists moddatetime schema extensions;

-- keep updated_at timestamps up to date on all tables
-- https://github.com/supabase/supabase/issues/379#issuecomment-755289862
-- TODO - also do updated_by? created_at? created_by?
create trigger keep_user_settings_updated       before update on user_settings      for each row execute procedure moddatetime (updated_at);
create trigger keep_user_roles_updated          before update on user_roles         for each row execute procedure moddatetime (updated_at);
create trigger keep_profiles_updated            before update on profiles           for each row execute procedure moddatetime (updated_at);
create trigger keep_profile_follows_updated     before update on profile_follows    for each row execute procedure moddatetime (updated_at);
create trigger keep_languages_updated           before update on languages          for each row execute procedure moddatetime (updated_at);
create trigger keep_language_votes_updated      before update on language_votes     for each row execute procedure moddatetime (updated_at);
create trigger keep_user_languages_updated      before update on user_languages     for each row execute procedure moddatetime (updated_at);
create trigger keep_topics_updated              before update on topics             for each row execute procedure moddatetime (updated_at);
create trigger keep_phrases_updated             before update on phrases            for each row execute procedure moddatetime (updated_at);
create trigger keep_phrase_issues_updated       before update on phrase_issues      for each row execute procedure moddatetime (updated_at);
create trigger keep_phrase_attempts_updated     before update on phrase_attempts    for each row execute procedure moddatetime (updated_at);
create trigger keep_chat_messages_updated       before update on chat_messages      for each row execute procedure moddatetime (updated_at);
create trigger keep_lessons_updated             before update on lessons            for each row execute procedure moddatetime (updated_at);
create trigger keep_lists_updated               before update on lists              for each row execute procedure moddatetime (updated_at);
create trigger keep_list_items_updated          before update on list_items         for each row execute procedure moddatetime (updated_at);
create trigger keep_media_updated               before update on media              for each row execute procedure moddatetime (updated_at);
create trigger keep_media_votes_updated         before update on media_votes        for each row execute procedure moddatetime (updated_at);
create trigger keep_mnemonics_updated           before update on mnemonics          for each row execute procedure moddatetime (updated_at);
create trigger keep_mnemonic_votes_updated      before update on mnemonic_votes     for each row execute procedure moddatetime (updated_at);

-------------------------------------------------
-----------------     VIEWS     -----------------
-------------------------------------------------

-- https://supabase.com/blog/2020/11/18/postgresql-views
create view heatmap_days as
  select    date(created_at), created_by, count(*)
  from      phrase_attempts
  where     created_at > current_date - interval '1 year'
  group by  date(created_at), created_by;

create view user_scores as
  select    created_by, count(distinct phrase)
  from      phrase_attempts
  where     is_correct = true
  group by  created_by;

-- https://stackoverflow.com/questions/27253333/how-to-calculate-ratio-using-sql-query
-- https://stackoverflow.com/questions/28736227/cast-syntax-to-convert-a-sum-to-float
create view user_phrase_scores as
  select
    created_by,
    phrase,
    count(*),
    sum(case when is_correct = true then 1 else 0 end) as num_correct,
    sum(case when is_correct = true then 1 else 0 end)::float/count(*)::float as percent_correct
  from phrase_attempts
  group by created_by, phrase;

-- End transaction
COMMIT;
