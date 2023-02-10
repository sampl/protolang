// This script updates the Dictionary table based on a JSON file of Wiktionary data
// Dictionary data lives in the `dictionaries` schema, separate from user data in `public`
// That means you should be able to run this script against the production database
// whenever without affecting users or creating foreign key errors

import pgPromise from 'pg-promise'
import dotenv from 'dotenv'
import LineByLineReader from 'line-by-line'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
const __dirname = dirname(fileURLToPath(import.meta.url))

dotenv.config({ path: '.env.development' })
const CONNECTION_STRING = process.env.ADMIN_POSTGRES_CONNECTION_STRING

const LIVE = process.argv[2] === '--live'

const LANGUAGE_CODE = `it`
const SCHEMA_NAME = `dictionaries`
const TABLE_NAME = `${SCHEMA_NAME}.${LANGUAGE_CODE}`
const DICTIONARY_FILE_PATH = `/../languages/${LANGUAGE_CODE}/kaikki.org-dictionary-Italian.json`
const BATCH_SIZE = 1000

// pg-promise setup
const pgp = pgPromise()
const db = pgp(CONNECTION_STRING)

let onDeck = []
let errors = []
let batchCount = 0

const updateDictionary = async () => {
  console.log('Updating dictionary...')

  try {
    console.time('Duration')

    // clear out previous data
    if (LIVE) {
      console.log('Removing old dictionary...')
      await db.none(`
        create schema if not exists ${SCHEMA_NAME};

        -- give permissions to postgres users
        grant all on               schema ${SCHEMA_NAME} to postgres, anon, authenticated, service_role, dashboard_user;
        grant all on all tables in schema ${SCHEMA_NAME} to postgres, anon, authenticated, service_role, dashboard_user;

        -- https://stackoverflow.com/a/73282539/1061063
        -- grant select, insert, update, delete on all tables in schema dictionaries to postgres, authenticated, service_role, dashboard_user, anon;
        -- grant usage, select on all sequences in schema dictionaries to postgres, authenticated, service_role, dashboard_user, anon;

        -- https://stackoverflow.com/a/69426939/1061063
        -- grant usage on schema dictionary to postgres, anon, authenticated, service_role;
        -- alter default privileges in schema dictionary grant all on tables to postgres, anon, authenticated, service_role;
        -- alter default privileges in schema dictionary grant all on functions to postgres, anon, authenticated, service_role;
        -- alter default privileges in schema dictionary grant all on sequences to postgres, anon, authenticated, service_role;

        -- alter default privileges for user supabase_admin in schema dictionary grant all
        --     on sequences to postgres, anon, authenticated, service_role;
        -- alter default privileges for user supabase_admin in schema dictionary grant all
        --     on tables to postgres, anon, authenticated, service_role;
        -- alter default privileges for user supabase_admin in schema dictionary grant all
        --     on functions to postgres, anon, authenticated, service_role;

        drop table if exists ${TABLE_NAME};

        alter table ${TABLE_NAME} enable row level security;
        create policy "Anyone can view a word"     on ${TABLE_NAME} for select using (true);
        create policy "Nobody can add a word"      on ${TABLE_NAME} for insert with check (false);
        create policy "Nobody can update a word"   on ${TABLE_NAME} for update using (false);
        create policy "Nobody can delete a word"   on ${TABLE_NAME} for delete using (false);

        create table ${TABLE_NAME} (
          id                bigint generated by default as identity primary key,

          word              text not null,
          pos               text,
          forms_of          jsonb,
          _wiktionary_data  jsonb not null,

          created_at        timestamptz default now() not null,
          updated_at        timestamptz default now() not null
        );
      `)
    }

    const sendBatch = (rows) => {
      const columnSet = new pgp.helpers.ColumnSet(
        ["word", "pos", "forms_of", "_wiktionary_data"],
        { table: {
            table: LANGUAGE_CODE,
            schema: SCHEMA_NAME,
          }
        },
      );
      console.log(`Got batch #${batchCount} of size ${rows.length}, starting with ${rows[0].word} ${LIVE ? '- sending to db...' : ''}`)
      if (LIVE) {
        const query = pgp.helpers.insert(rows, columnSet)
        return db.none(query)
      }
    }

    // unlike readline, this actually pauses events when paused
    // https://stackoverflow.com/a/44277990/1061063
    const reader = new LineByLineReader(__dirname + DICTIONARY_FILE_PATH)

    reader.on('line', async line => {
      const parsedLine = JSON.parse(line)
      const row = {
        word: parsedLine.word,
        pos: parsedLine.pos,
        forms_of: JSON.stringify(parsedLine.senses.map(s => s.form_of).flat().map(f => f?.word).flat()),
        '_wiktionary_data': parsedLine,
      }
      onDeck.push(row)

      if (onDeck.length >= BATCH_SIZE) {
        reader.pause()
        batchCount++
        await sendBatch(onDeck)
        onDeck = []
        reader.resume()
      }
    })

    reader.on('error', error => {
      errors.push(error)
    })

    reader.on('end', async () => {
      // send whatever was queued up at the end of the list (but never hit the BATCH_SIZE limit)
      await sendBatch(onDeck)

      console.log(`${batchCount} batches ${LIVE ? 'sent to the database' : 'processed as a test'}`)
      if (errors.length === 0) {
        console.log('Done, with no errors ✅')
      } else {
        console.log('Script is done, with errors ❌')
        errors.forEach(error => {
          console.log(`  - ${error.message || 'unknown error'}`)
        })
      }

      // https://www.valentinog.com/blog/node-usage/
      const used = process.memoryUsage().heapUsed / 1024 / 1024
      console.log(`Memory: ~${Math.round(used * 100) / 100}mb`)
      console.timeEnd('Duration')
    })

  } catch (error) {
    console.error(error)
  }
}

updateDictionary()