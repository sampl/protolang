// don't even let devs do this on live
require('dotenv').config({ path: '.env.development' })

const { Client } = require('pg')

// delete tables in the reverse order of their creation to avoid foreign key errors
const clearSql = `
  alter table lessons drop column current_edit;

  drop view if exists heatmap_days;
  drop view if exists user_scores;
  drop view if exists user_phrase_scores;

  drop table if exists migrations;
  drop table if exists resource_votes;
  drop table if exists resources;
  drop table if exists mnemonic_votes;
  drop table if exists mnemonics;
  drop table if exists media_votes;
  drop table if exists media;
  drop table if exists list_items;
  drop table if exists lists;
  drop table if exists lesson_edits;
  drop table if exists lessons;
  drop table if exists chat_messages;
  drop table if exists chat_conversations;
  drop table if exists practice_attempts;
  drop table if exists phrase_issues;
  drop table if exists phrases;
  drop table if exists topics;
  drop table if exists words cascade;
  drop table if exists user_languages;
  drop table if exists language_votes;
  drop table if exists languages cascade;
  drop table if exists profile_follows;
  drop table if exists profiles;
  drop table if exists users;

  drop type if exists phrase_types;
  drop type if exists practice_attempts_correct_types;
  drop type if exists chat_message_sender_types;
  drop type if exists media_types;

  drop table if exists user_roles;
  drop trigger if exists on_auth_user_created on auth.users;

  drop function if exists handle_new_user;
  drop function if exists user_is_admin;
  drop function if exists user_admin_row;

  drop type if exists user_role_types;
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