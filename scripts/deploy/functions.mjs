// WORK IN PROGRESS - Throws a standard error, but also seems to dump the file

import { promises as fs } from 'fs'
import util from 'util'
import * as child from 'child_process'
const exec = util.promisify(child.exec)

import { dirname } from 'path'
import { fileURLToPath } from 'url'
const __dirname = dirname(fileURLToPath(import.meta.url))

import minimist from 'minimist'
const argv = minimist(process.argv.slice(2))

import dotenv from 'dotenv'
dotenv.config({ path: argv._.includes('prod') ? '.env.production' : '.env.development' })
const SUPABASE_PROJECT_ID = process.env.SUPABASE_PROJECT_ID

const FUNCTIONS_DIR = '/../../supabase/functions/'

console.log('Deploying functions')

const deployFunctions = async () => {
  try {

    // TODO - automatically get list of functions by looking in the .supabase folder
    console.log('  Getting function names')
    const path = __dirname + FUNCTIONS_DIR
    const filenames = await fs.readdir(path)
    console.log('got dirs: '+JSON.stringify(filenames))
    const functionNames = filenames.filter(filename => {
      return filename[0] !== '_'
    })

    console.log('  Updating secrets')
    const { stdout: stdout1, stderr: stderr1 } = await exec(`supabase secrets set --env-file ${argv._.includes('prod') ? '.env.production' : '.env.development'}`)
    if (stderr1) throw new Error(stderr1)
    console.log(stdout1)

    // TODO - works in command link but not in exec
    console.log('  Generating deploy command')
    let command = 'echo "Starting deploy"'
    functionNames.forEach(name => {
      command+= ` && supabase functions deploy ${name} --project-ref ${SUPABASE_PROJECT_ID}`
    })

    console.log('\n  Finished deploy command')
    console.log(command+'\n\n')

    console.log('  Running deploy command')
    const { stdout: stdout2, stderr: stderr2 } = await exec(command)
    if (stderr2) throw new Error(stderr2)
    console.log(stdout2)

    console.log('✅ Deploy successful')
  } catch (error) {
    console.error(error)
    console.log('❌ Deploy error')
  }
}

deployFunctions()
