const { Client } = require('pg')
require('dotenv').config()

const connectionString = process.env.ADMIN_POSTGRES_CONNECTION_STRING
const client = new Client({ connectionString })

const migrate = async () => {
  await client.connect()
  
  const res = await client.query('SELECT * FROM words')
  console.log('result:', res.rows[0])
  
  await client.end()
}

migrate()