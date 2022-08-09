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
const DESTRUCTIVE = myArgs[1] === '--destructive'

const LANGUAGE_CODE = 'it'
const DICTIONARY_FILE_PATH = `/../../languages/${LANGUAGE_CODE}/kaikki.org-dictionary-Italian.json`

const BATCH_SIZE = 1

const TABLE_NAME = `words_it`

// pg-promise setup
const pgp = pgPromise()
const db = pgp(CONNECTION_STRING)

const columns = [
  {
    name: 'pos',
    type: 'text',
  },
  {
    name: 'head_templates',
    type: 'text',
  },
  {
    name: 'forms',
    type: 'jsonb',
  },
  {
    name: 'inflection_templates',
    type: 'jsonb',
  },
  {
    name: 'etymology_text',
    type: 'text',
  },
  {
    name: 'etymology_templates',
    type: 'jsonb',
  },
  {
    name: 'sounds',
    type: 'jsonb',
  },
  {
    name: 'word',
    type: 'text',
  },
  {
    name: 'lang',
    type: 'text',
  },
  {
    name: 'lang_code',
    type: 'text',
  },
  {
    name: 'categories',
    type: 'jsonb',
  },
  {
    name: 'derived',
    type: 'jsonb',
  },
  {
    name: 'related',
    type: 'jsonb',
  },
  {
    name: 'senses',
    type: 'jsonb',
  },
]

const columnSet = new pgp.helpers.ColumnSet(columns.map(c => c.name), {table: TABLE_NAME});

const updateDictionary = async () => {
  try {

    console.time('Duration')

    // clear out previous data
    if (DESTRUCTIVE) {
      console.log('--destructive flag detected, removing existing lessons...')
      await db.none(`DELETE FROM ${TABLE_NAME};`)



      // TODO - instead of clearing them all out, straight up drop table and recreated columns accordingly



    }
  
    let onDeck = []
    let errors = []

    // unlike readline, this actually pauses events when paused
    // https://stackoverflow.com/a/44277990/1061063
    const reader = new LineByLineReader(__dirname + DICTIONARY_FILE_PATH)

    reader.on('error', errors.push)

    reader.on('line', async line => {
      const parsedLine = JSON.parse(line)
      onDeck.push(parsedLine)
      if (onDeck.length >= BATCH_SIZE) {
        reader.pause()
        console.log(onDeck.length, 'words ready to go')
        await updateDatabase(onDeck)
        onDeck = []
        reader.resume()
      }
    })

    reader.on('end', () => {

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

const updateDatabase = async parsedDictionaryLines => {
  
  // ensure the obj we pass has keys for every column
  const data = parsedDictionaryLines.map(parsedLine => {
    const row = {}
    columns.forEach(column => {
      // console.log(column.name)
      row[column.name] = parsedLine[column.name] || (column.type === 'jsonb' ? [] : null)
    })
    return row
  })

  console.log(data)

  if (!LIVE) {
    // console.log(parsedDictionaryLines.map(Object.keys))
    // console.log('Skipping update: ', parsedDictionaryLines.word)
    return null
  }

  const query = pgp.helpers.insert(data, columnSet)

  // http://vitaly-t.github.io/pg-promise/Database.html#none
  return db.none(query)
}

updateDictionary()
