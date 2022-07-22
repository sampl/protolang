const { Client } = require('pg')
require('dotenv').config()

const connectionString = process.env.ADMIN_POSTGRES_CONNECTION_STRING
const client = new Client({ connectionString })

// https://supabase.com/blog/2020/11/18/postgresql-views
const HEATMAP_VIEW = `
  CREATE OR REPLACE VIEW heatmap_days AS
    SELECT    date(created_at), created_by, COUNT(*)
    FROM      attempts
    WHERE     created_at > CURRENT_DATE - INTERVAL '1 year'
    GROUP BY  date(created_at), created_by;
`

const migrate = async () => {
  await client.connect()
  
  try {
    // const res = await client.query('SELECT * FROM words')
    // console.log('result:', res.rows[0])
    await client.query(HEATMAP_VIEW)
  } catch (error) {
    console.error(error)
  }
  
  await client.end()
}

migrate()