import { promises as fs } from 'fs'

import pg from 'pg'
const Client = pg.Client

import { dirname } from 'path'
import { fileURLToPath } from 'url'
const __dirname = dirname(fileURLToPath(import.meta.url))

import minimist from 'minimist'
const argv = minimist(process.argv.slice(2))
const NEW_DATABASE = argv._.includes('new')

import dotenv from 'dotenv'
dotenv.config({ path: argv._.includes('prod') ? '.env.production' : '.env.development' })
const CONNECTION_STRING = process.env.ADMIN_POSTGRES_CONNECTION_STRING

const MIGRATION_DIR = '/migrations/'

console.log('Running migrations')

const migrate = async () => {

  console.log('  Connecting to database')
  if (!CONNECTION_STRING) throw new Error('No connection string found')
  const client = new Client({ connectionString: CONNECTION_STRING })
  await client.connect()

  try {
    console.log('  Getting migration files')
    const path = __dirname + MIGRATION_DIR
    const filenames = await fs.readdir(path)
    let migrationFiles = await Promise.all(filenames.map(async filename => {
      const content = await fs.readFile(path + filename, 'utf-8')
      const sql = content.toString()
      const id = parseInt(filename.split(' - ')[0])
      return { id, filename, sql }
    }))
    console.log('    '+migrationFiles.map(m => m.filename).join('\n    '))

    console.log('  Checking for past migrations')
    const migrationTableExistsResult = await client.query('SELECT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = \'public\' and tablename = \'migrations\')')
    const migrationTableExists = migrationTableExistsResult.rows?.[0]?.exists
    console.log('    Migration table?', migrationTableExists)

    if (!migrationTableExists && !NEW_DATABASE) {
      throw new Error('To run migrations on a new database, you must pass the --new flag')
    } else if (migrationTableExists && NEW_DATABASE) {
      throw new Error('You passed the --new flag, but this database already has a migrations table')
    } else if (!migrationTableExists && NEW_DATABASE) {
      console.log('  New database and no migrations table found, running all migrations')
    } else {
      console.log('  Getting last run migration from database')
      const mostRecentMigrationResult = await client.query('SELECT id FROM migrations ORDER BY id DESC LIMIT 1')
      const mostRecentMigrationId = mostRecentMigrationResult.rows[0].id

      console.log('  Filtering list of migrations to run')
      migrationFiles = migrationFiles.filter(m => m.id > mostRecentMigrationId )
    }

    // TODO - save which migrations have been run to the db 

    console.log('  Applying migrations to the database')
    for (const migration of migrationFiles) {
      console.log(`    Running migration: ${migration.id}`)
      await client.query(migration.sql)
      console.log(`    Saving record to migrations table: ${migration.id}`)
      await client.query('insert into migrations (id, created_at) values ($1, $2)', [migration.id, new Date()])
    }

    console.log('✅ Migrations successful')
  } catch (error) {
    console.log('❌ Migrations error')
    console.error(error)
  }

  await client.end()
}

migrate()