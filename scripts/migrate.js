const { Client } = require('pg')
require('dotenv').config()

const fs = require('fs')

const connectionString = process.env.ADMIN_POSTGRES_CONNECTION_STRING
const client = new Client({ connectionString })
console.log('connectionString', connectionString)

const sql = fs.readFileSync(__dirname + '/migrations/1 - initial setup.sql').toString()
console.log('sql', '\n\nSQL Preview:\n\n'+sql.substring(0, 300)+'...\n\n')

const migrate = async () => {

  console.log('connecting to database...')
  await client.connect()
  
  try {
    console.log('querying database...')
    await client.query(sql)
  } catch (error) {
    console.error(error)
  }
  
  await client.end()
  console.log('done!')
}

migrate()