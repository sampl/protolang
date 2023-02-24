// This script updates the Phrases table based on a text file archive generated in the app

import pg from 'pg'
const Client = pg.Client
import { promises as fs } from 'fs'
import dotenv from 'dotenv'

import { dirname } from 'path'
import { fileURLToPath } from 'url'
const __dirname = dirname(fileURLToPath(import.meta.url))

dotenv.config({ path: '.env.development' })
const CONNECTION_STRING = process.env.ADMIN_POSTGRES_CONNECTION_STRING
const SEED_USER_ID = process.env.SEED_USER_ID

const myArgs = process.argv.slice(2)
const LIVE = myArgs[0] === 'live'

const LANGUAGE_CODE = 'it'
const FOLDER_NAME = 'Protolang phrases (IT) - 1677248698'
const PHRASES_FILE_PATH = `/../../data/${FOLDER_NAME}/`

console.log('Updating phrases...')

const updatePhrases = async() => {
  try {
    console.time('Duration')

    const phraseFiles = await getPhraseFilesContent(PHRASES_FILE_PATH)
    const parsedPhrases = await Promise.all(phraseFiles.map(parsePhraseFile))
    await updateDatabase(parsedPhrases)

    // https://www.valentinog.com/blog/node-usage/
    const used = process.memoryUsage().heapUsed / 1024 / 1024
    console.log(`Memory: ~${Math.round(used * 100) / 100}mb`)
    console.timeEnd('Duration')
    console.log('Done, with no errors ✅')
  } catch (error) {
    console.error(error)
    console.log('Script is done, with errors ❌')
  }
}

const getPhraseFilesContent = async relativePath => {
  console.log(`  Getting phrase file contents`)
  const absolutePath = __dirname + relativePath
  const fileNames = await fs.readdir(absolutePath)
  return Promise.all(fileNames.map(async fileName => {
    const fileContents = await fs.readFile(absolutePath + fileName, 'utf-8')
    return { fileName, fileContents }
  }))
}

const parsePhraseFile = async ({ fileName, fileContents }) => {

  console.log(`  Parsing phrase: ${fileName}`)

  const fileContentsLines = fileContents.split('\n')

  // const id = fileContentsLines[0]
  // const language_id = fileContentsLines[1]
  const content_it = fileContentsLines[2]
  const it_alts_string = fileContentsLines[3]
  const content_en = fileContentsLines[4]
  const en_alts_string = fileContentsLines[5]

  const it_alts = it_alts_string ? it_alts_string.split('\t') : []
  const en_alts = en_alts_string ? en_alts_string.split('\t') : []

  if (!content_it) {
    throw new Error(`Invalid content_it "${fileContentsLines[0]}" in phrase ${fileName}`)
  }
  if (!content_en) {
    throw new Error(`Invalid content_en "${fileContentsLines[1]}" in phrase ${fileName}`)
  }

  return {
    content_it,
    content_en,
    en_alts,
    it_alts,
  }
}

const updateDatabase = async phrases => {

  if (!LIVE) {
    console.log('Skipping db update, to run it for real use "--live"')
    return
  }

  console.log('  Connecting to database')
  const client = new Client({ connectionString: CONNECTION_STRING })
  await client.connect()
  
  console.log('  Adding new phrases')

  // TODO - run in batches!
  await Promise.all(phrases.map(async phrase => {

    console.log(`    Adding phrase: ${phrase.content_it}`)

    const phraseValues = [
      LANGUAGE_CODE,
      phrase.content_it,
      phrase.content_en,
      phrase.en_alts,
      phrase.it_alts,
      new Date(),
      SEED_USER_ID,
    ]
    const phraseQuery = `
      INSERT INTO phrases(language_id, content_it, content_en, en_alts, it_alts, created_at, created_by)
      VALUES($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `
    await client.query(phraseQuery, phraseValues)
  }))

  await client.end()
}

updatePhrases()
