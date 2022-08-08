import pg from 'pg'
const Client = pg.Client

import dotenv from 'dotenv'
import lr from 'readline'
import fs from 'fs'

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

let lineNum = 0

const updateDictionary = async () => {
  try {

    const client = new Client({ connectionString: CONNECTION_STRING })
    await client.connect()
  
    // clear out previous data
    if (DESTRUCTIVE) {
      console.log('--destructive flag detected, removing existing lessons...')
      await client.query('DELETE FROM words;')
    }
  
    // https://stackoverflow.com/questions/6156501/read-a-file-one-line-at-a-time-in-node-js
    var lineReader = lr.createInterface({
      input: fs.createReadStream(__dirname + DICTIONARY_FILE_PATH)
    })
    
    lineReader.on('line', line => {
      lineNum++
      const parsedDictionaryLines = parseDictionaryLine(line)
      return updateDatabase(parsedDictionaryLines)
    })

    await client.end()
  } catch (error) {
    console.error(error)
  }
}

const parseDictionaryLine = line => {
  const parsed = JSON.parse(line)
  const { word, senses, pos } = parsed
  if (!senses || senses.length < 1) {
    throw new Error(`The word ${word} at line ${lineNum} has no senses`)
  }
  const words = senses.map(sense => {
    if (!sense.form_of || sense.form_of.length < 1) {
      console.warn(`  The word ${word} has a sense ${sense.id} at line ${lineNum} with no form root`)
      return null
    }
    return {
      name: word,
      part_of_speech: pos,
      root_word: sense.form_of[0].word,
    }
  })
  return words
}

const updateDatabase = async parsedDictionaryLines => {
  if (!LIVE) {
    console.log('Skipping update: ', parsedDictionaryLines)
    return
  }

  return Promise.all(parsedDictionaryLines.map(async sense => {
    const text = 'INSERT INTO words(name, part_of_speech, root_word) VALUES($1, $2, $3) RETURNING *'
    await client.query(text, sense)
  }))
}

updateDictionary()
