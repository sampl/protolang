import pgPromise from 'pg-promise'
import dotenv from 'dotenv'
import LineByLineReader from 'line-by-line'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
const __dirname = dirname(fileURLToPath(import.meta.url))

dotenv.config()
const CONNECTION_STRING = process.env.ADMIN_POSTGRES_CONNECTION_STRING

const myArgs = process.argv.slice(2)
const LIVE = myArgs[0] === '--live'

const LANGUAGE_CODE = 'it'
const DICTIONARY_FILE_PATH = `/../../languages/${LANGUAGE_CODE}/kaikki.org-dictionary-Italian.json`

const BATCH_SIZE = 1000

const TABLE_NAME = `words_it`

// pg-promise setup
const pgp = pgPromise()
const db = pgp(CONNECTION_STRING)

const columnSet = new pgp.helpers.ColumnSet(["wiktionary_data"], {table: TABLE_NAME});

let onDeck = []
let errors = []
let batch = 0

const updateDictionary = async () => {

  try {
    console.time('Duration')

    // clear out previous data
    if (LIVE) {
      console.log('Removing existing words...')
      await db.none(`DELETE FROM ${TABLE_NAME};`)
    }  
  
    // unlike readline, this actually pauses events when paused
    // https://stackoverflow.com/a/44277990/1061063
    const reader = new LineByLineReader(__dirname + DICTIONARY_FILE_PATH)

    reader.on('line', async line => {
      const parsedLine = JSON.parse(line)
      const row = { 'wiktionary_data': parsedLine }
      onDeck.push(row)

      if (onDeck.length >= BATCH_SIZE) {
        reader.pause()
        batch++
        await sendBatch(onDeck)
        onDeck = []
        reader.resume()
      }
    })

    reader.on('error', errors.push)

    reader.on('end', async () => {

      // send whatever was queued up at the end of the list (but never hit the BATCH_SIZE limit)
      await sendBatch(onDeck)

      if (errors.length === 0) {
        console.log('Done, with no errors ✅')
      } else {
        console.log('Script is done, with errors ❌')
        errors.forEach(error => {
          console.log(`  - ${error.message || 'unknown error'}`)
        })
      }

      console.log(`${batch} batches ${LIVE ? 'sent to the database' : 'processed as a test'}`)

      // https://www.valentinog.com/blog/node-usage/
      const used = process.memoryUsage().heapUsed / 1024 / 1024
      console.log(`Memory: ~${Math.round(used * 100) / 100}mb`)
  
      console.timeEnd('Duration')
    })

  } catch (error) {
    console.error(error)
  }
}

const sendBatch = () => {
  console.log(`Got batch #${batch} of size ${onDeck.length} ${LIVE ? '- sending to db...' : ''}`)

  if (LIVE) {
    const query = pgp.helpers.insert(onDeck, columnSet)
    return db.none(query)
  }
}

updateDictionary()
