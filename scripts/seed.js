// don't even let devs do this on live
require('dotenv').config({ path: '.env.development' })

const { Client } = require('pg')
const fs = require('fs')

const SEEDS_DIR = '/seeds/'
const USER_ID = process.env.SEED_USER_ID

console.log('Running seeds')

const seed = async () => {

  console.log('  Connecting to database')
  const connectionString = process.env.ADMIN_POSTGRES_CONNECTION_STRING
  if (!connectionString) throw new Error('No connection string found')
  const client = new Client({ connectionString })
  await client.connect()

  let seedFiles

  try {
    console.log('  Getting seed files')
    const path = __dirname + SEEDS_DIR
    const filenames = await fs.promises.readdir(path)
    const seedFilePromises = filenames.map(async filename => {
      const content = await fs.promises.readFile(path + filename, 'utf-8')
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
    const seedQueryPromises = seedFiles.map(async sf => {
      return client.query(sf.sql).then(res => {
        console.log(`    Ran seed on seed ${sf.filename}`)
      })
    })
    await Promise.all(seedQueryPromises)

    console.log('✅ Seed successful')
  } catch (error) {
    console.log('❌ Seed error')
    console.error(error)
  }

  await client.end()
}

seed()