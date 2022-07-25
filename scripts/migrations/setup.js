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
const USER_SCORE_VIEW = `
  CREATE OR REPLACE VIEW user_scores AS
    SELECT    created_by, COUNT(DISTINCT word)
    FROM      attempts
    WHERE     correct = true
    GROUP BY  created_by;
`
// https://stackoverflow.com/questions/27253333/how-to-calculate-ratio-using-sql-query
// https://stackoverflow.com/questions/28736227/cast-syntax-to-convert-a-sum-to-float
const USER_WORD_SCORE_VIEW = `
  CREATE OR REPLACE VIEW user_word_scores AS
    SELECT
      created_by,
      word,
      count(*),
      sum(case when correct = true then 1 else 0 end) as num_correct,
      sum(case when correct = true then 1 else 0 end)::float/count(*)::float as percent_correct
    FROM attempts
    GROUP BY created_by, word;
`

const migrate = async () => {
  await client.connect()
  
  try {
    // const res = await client.query('SELECT * FROM words')
    // console.log('result:', res.rows[0])
    await client.query(HEATMAP_VIEW)
    await client.query(USER_SCORE_VIEW)
    await client.query(USER_WORD_SCORE_VIEW)
  } catch (error) {
    console.error(error)
  }
  
  await client.end()
}

migrate()