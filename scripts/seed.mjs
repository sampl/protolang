import { promises as fs } from 'fs'

import pg from 'pg'
const Client = pg.Client

import { dirname } from 'path'
import { fileURLToPath } from 'url'
const __dirname = dirname(fileURLToPath(import.meta.url))

import minimist from 'minimist'
const argv = minimist(process.argv.slice(2))

import dotenv from 'dotenv'
dotenv.config({ path: argv._.includes('prod') ? '.env.production' : '.env.development' })
const CONNECTION_STRING = process.env.ADMIN_POSTGRES_CONNECTION_STRING

const SEEDS_DIR = '/seeds/'
const USER_ID = process.env.SEED_USER_ID

console.log('Running seeds')

const seed = async () => {

  console.log('  Connecting to database')
  if (!CONNECTION_STRING) throw new Error('No connection string found')
  const client = new Client({ connectionString: CONNECTION_STRING })
  await client.connect()

  let seedFiles

  try {
    console.log('  Getting seed files')
    const path = __dirname + SEEDS_DIR
    const filenames = await fs.readdir(path)
    const seedFilePromises = filenames.map(async filename => {
      const content = await fs.readFile(path + filename, 'utf-8')
      const sql = content.toString()
      return { filename, sql }
    })
    seedFiles = await Promise.all(seedFilePromises)
    console.log('    '+seedFiles.map(sf => sf.filename).join('\n    '))

    console.log('  Replacing placeholder data (user IDs etc)')
    seedFiles = seedFiles.map(sf => {
      console.log(`    Running replace on ${sf.filename}`)
      const regex = /USER_ID/ig;
      const sql = sf.sql.replaceAll(regex, USER_ID)
      return {
        ...sf,
        sql,
      }
    })

    console.log('  Applying seeds to the database')
    for (const sf of seedFiles) {
      await client.query(sf.sql).then(res => {
        console.log(`    Ran seed on seed file ${sf.filename}`)
      })
    }

    console.log('✅ Seed successful')
  } catch (error) {
    console.log('❌ Seed error')
    console.error(error)
  }

  await client.end()
}

seed()