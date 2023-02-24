// don't even let devs do this on live
require('dotenv').config({ path: '.env.development' })

const { Client } = require('pg')

// delete tables in the reverse order of their creation to avoid foreign key errors
const clearSql = `
  alter table public.lessons drop column current_edit;

  drop view if exists public.heatmap_days;
  drop view if exists public.user_scores;
  drop view if exists public.user_phrase_scores;

  drop table if exists public.migrations;
  drop table if exists public.resource_votes;
  drop table if exists public.resources;
  drop table if exists public.mnemonic_votes;
  drop table if exists public.mnemonics;
  drop table if exists public.media_votes;
  drop table if exists public.media;
  drop table if exists public.list_items;
  drop table if exists public.lists;
  drop table if exists public.lesson_edits;
  drop table if exists public.lessons;
  drop table if exists public.chat_messages;
  drop table if exists public.chat_conversations;
  drop table if exists public.practice_attempts;
  drop table if exists public.phrase_issues;
  drop table if exists public.phrases;
  drop table if exists public.topics;
  drop table if exists public.words cascade;
  drop table if exists public.user_languages;
  drop table if exists public.language_votes;
  drop table if exists public.languages cascade;
  drop table if exists public.profile_follows;
  drop table if exists public.profiles;
  drop table if exists public.users;

  drop type if exists public.phrase_types;
  drop type if exists public.practice_attempts_correct_types;
  drop type if exists public.chat_message_sender_types;
  drop type if exists public.media_types;

  drop table if exists public.user_roles;
  drop trigger if exists on_auth_user_created on auth.users;

  drop function if exists public.handle_new_user;
  drop function if exists public.user_is_admin;
  drop function if exists public.user_admin_row;

  drop type if exists public.user_role_types;
`

console.log('Clearing database')

const clear = async () => {
  const connectionString = process.env.ADMIN_POSTGRES_CONNECTION_STRING
  if (!connectionString) throw new Error('No connection string found')
  const client = new Client({ connectionString })
  
  try {
    console.log('  Connecting to database')
    await client.connect()
    console.log('  Running clear script')
    await client.query(clearSql)
    console.log('✅ Clear successful')
  } catch (error) {
    console.log('❌ Clear error')
    console.error(error)
  } finally {
    await client.end()
  }
}

clear()