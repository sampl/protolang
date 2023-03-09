// WORK IN PROGRESS - Throws a standard error, but also seems to dump the file

import util from 'util'
import * as child from 'child_process'
const exec = util.promisify(child.exec)

import minimist from 'minimist'
const argv = minimist(process.argv.slice(2))

import dotenv from 'dotenv'
dotenv.config({ path: argv._.includes('prod') ? '.env.production' : '.env.development' })
const CONNECTION_STRING = process.env.ADMIN_POSTGRES_CONNECTION_STRING

const DUMP_SCRIPTS_DIR = './temp/'

console.log('Running dumps')

const backup = async () => {
  try {
    if (!CONNECTION_STRING) throw new Error('No connection string found')

    console.log('  Generating pg_dump command')
    let command = `pg_dump ${CONNECTION_STRING} -f ${DUMP_SCRIPTS_DIR}db.sql --verbose `

    // https://stackoverflow.com/questions/3682866/how-to-create-a-backup-of-a-single-table-in-a-postgres-database
    console.log('  Adding optional flags')
    command+= ` --column-inserts`
    command+= ' --schema-only'
    command+= ` --schema 'public'`
    command+= ` --table public.lessons`

    console.log('\n  Finished command')
    console.log(command+'\n\n')

    console.log('  Running backup with pg_dump')
    const { stdout, stderr } = await exec(command)
    if (stderr) throw new Error(stderr)
    console.log(stdout)

    console.log('✅ Dump successful')
  } catch (error) {
    console.error(error)
    console.log('❌ Dump error')
  }
}

backup()
