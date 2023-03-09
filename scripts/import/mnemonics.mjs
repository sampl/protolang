// This script updates the Mnemonics table based on a text file archive generated in the app

import { promises as fs } from 'fs'

import pg from 'pg'
const Client = pg.Client

import { dirname } from 'path'
import { fileURLToPath } from 'url'
const __dirname = dirname(fileURLToPath(import.meta.url))

import minimist from 'minimist'
const argv = minimist(process.argv.slice(2))
const DRY_RUN = !argv._.includes('live')

import dotenv from 'dotenv'
dotenv.config({ path: argv._.includes('prod') ? '.env.production' : '.env.development' })
const CONNECTION_STRING = process.env.ADMIN_POSTGRES_CONNECTION_STRING
const SEED_USER_ID = process.env.SEED_USER_ID

const LANGUAGE_CODE = 'it'
const FOLDER_NAME = 'Protolang mnemonics (IT)'
const MNEMONICS_FILE_PATH = `/../../data/${FOLDER_NAME}/`

console.log('Updating mnemonics...')

const updateMnemonics = async() => {
  try {
    console.time('Duration')

    const mnemonicFiles = await getMnemonicFilesContent(MNEMONICS_FILE_PATH)
    const parsedMnemonicsArray = await Promise.all(mnemonicFiles.map(parseMnemonicFile))
    await updateDatabase(parsedMnemonicsArray.flat())

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

const getMnemonicFilesContent = async relativePath => {
  console.log(`  Getting mnemonic file contents`)
  const absolutePath = __dirname + relativePath
  const fileNames = await fs.readdir(absolutePath)
  return Promise.all(fileNames.map(async fileName => {
    const fileContents = await fs.readFile(absolutePath + fileName, 'utf-8')
    return { fileName, fileContents }
  }))
}

const parseMnemonicFile = async ({ fileName, fileContents }) => {
  console.log(`  Parsing mnemonic: ${fileName}`)
  const target_phrase = fileName.split('.md')[0]
  const fileContentsLines = fileContents.split('\n')
  const mnemonics = fileContentsLines.map(parseMnemonicLine => {
    const mnemonic = parseMnemonicLine.split('\t')
    return {
      target_phrase,
      remember_method: mnemonic[0],
      created_by: mnemonic[1],
    }
  })
  return mnemonics
}

const updateDatabase = async mnemonics => {

  if (DRY_RUN) {
    console.log('Dry run, skipping db update')
    return
  }

  console.log('  Connecting to database')
  const client = new Client({ connectionString: CONNECTION_STRING })
  await client.connect()
  
  console.log('  Adding new mnemonics')

  // TODO - run in batches!
  for (const mnemonic of mnemonics) {

    console.log(`    Adding mnemonic: ${mnemonic.id}`)

    const mnemonicValues = [
      LANGUAGE_CODE,
      mnemonic.target_phrase,
      mnemonic.remember_method,
      new Date(),

      // TODO - use real author here
      // should use mnemonic.created by, but it won't work crossing environments
      SEED_USER_ID,
    ]
    const mnemonicQuery = `
      INSERT INTO mnemonics(language_id, target_phrase, remember_method, created_at, created_by)
      VALUES($1, $2, $3, $4, $5)
      RETURNING *
    `
    await client.query(mnemonicQuery, mnemonicValues)
  }

  await client.end()
}

updateMnemonics()
