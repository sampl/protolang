// only to clear out test data while this file is being developed

// TODO - get from env file to support different dev environments
// but don't even code the part that does this on live, run it once and don't commit the code
require('dotenv').config({ path: '.env.development' })

const { Client } = require('pg')

// delete tables in the reverse order of their creation to avoid foreign key errors
const clearSql = `
  drop view if exists heatmap_days;
  drop view if exists user_scores;
  drop view if exists user_phrase_scores;

  drop table if exists migrations;
  drop table if exists resource_ratings;
  drop table if exists resources;
  drop table if exists mnemonic_votes;
  drop table if exists mnemonics;
  drop table if exists media_ratings;
  drop table if exists media;
  drop table if exists list_items;
  drop table if exists lists;
  drop table if exists lessons;
  drop table if exists chat_messages;
  drop table if exists chat_conversations;
  drop table if exists practice_attempts;
  drop table if exists phrase_issues;
  drop table if exists phrases;
  drop table if exists words cascade;
  drop table if exists user_languages;
  drop table if exists languages cascade;
  drop table if exists profile_follows;
  drop table if exists profiles;
  drop table if exists users;

  drop type if exists sender_type;
  drop type if exists media_type;
  drop type if exists mnemonic_vote_type;

  drop trigger if exists on_auth_user_created on auth.users;
  drop function if exists handle_new_user;
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