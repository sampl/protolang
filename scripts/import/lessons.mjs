// This script updates the Lessons and Lesson Edits tables
// based on an archive folder of text files generated in the app
// original: https://github.com/sampl/protolang/blob/d650294c1d4b9977670385da9e9360c2f4952fbc/scripts/data/updateLessons.mjs

import { promises as fs } from 'fs'
import {unified} from 'unified'
import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import remarkDirective from 'remark-directive'
import slugify from 'slugify'
import yaml from 'yaml'
// import supabase from '@supabase/supabase-js'

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
const FOLDER_NAME = 'Protolang lessons (IT)'
const LESSONS_FILE_PATH = `/../../data/${FOLDER_NAME}/`

console.log('Updating lessons...')

const updateLessons = async() => {
  try {
    console.time('Duration')

    const lessonFiles = await getLessonFilesContent(LESSONS_FILE_PATH)
    const parsedLessons = await Promise.all(lessonFiles.map(parseLessonFile))
    await updateDatabase(parsedLessons)

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

const getLessonFilesContent = async relativePath => {
  const absolutePath = __dirname + relativePath
  const fileNames = await fs.readdir(absolutePath)
  return Promise.all(fileNames.map(async fileName => {
    const fileContents = await fs.readFile(absolutePath + fileName, 'utf-8')
    return { fileName, fileContents }
  }))
}

const parseLessonFile = async ({ fileName, fileContents }) => {

  console.log(`  Parsing lesson file ${fileName}`)

  // https://chat.openai.com/chat/aa03c1c5-d8d6-4f70-a855-cbce64977104
  const regex = /^---\n([\s\S]*?)\n---\n/
  const match = fileContents.match(regex)

  if (!match) {
    throw new Error(`Could not find frontmatter for file ${fileName}`)
  }

  const yamlStr = match[1]
  const metadata = yaml.parse(yamlStr)

  if (!metadata) throw new Error('Could not parse yaml for frontmatter in ' + fileName)
  if (!metadata.unit && metadata.unit !== 0) throw new Error('Missing unit in frontmatter in ' + fileName)
  if (!metadata.sort_order && metadata.sort_order !== 0) throw new Error('Missing sort_order in frontmatter in ' + fileName)
  if (!metadata.title_eng) throw new Error('Missing title_eng in frontmatter in ' + fileName)
  
  let { unit, sort_order, title_eng, title_ita, topics } = metadata

  const content = fileContents.slice(match[0].length)

  const phrases = await parsePhrasesFromLessonContent(fileContents)

  // https://www.npmjs.com/package/slugify
  const slug = slugify(title_eng, {
    lower: true,
    strict: true,
  })
  if (!slug || slug.length < 1) {
    throw new Error(`Invalid slug generated for title_eng "${title_eng}" in file ${fileName}`)
  }

  topics = topics || []

  console.log(`LESSON UNIT AND TOPICS, ${unit}, ${topics?.join(' - ')}`)
  const lesson = {
    unit,
    sort_order,
    title_eng,
    title_ita,
    slug,
    topics,
    content,
    phrases,
  }

  console.log('  Got lesson: ', JSON.stringify(lesson).slice(0, 50))

  return lesson
}

// TODO - make this an edge function called automatically on lesson edit?
const parsePhrasesFromLessonContent = async content => {

  let phraseStringObjects
  await unified()
    .use(remarkParse)
    .use(remarkDirective)
    .use(() => tree => {
      const allSubChildren = tree?.children.map(c => c.children || []).flat()
      const directives = allSubChildren.filter(c => c.type.includes('Directive'))
      phraseStringObjects = directives.map(directive => {
        return {
          it: directive.attributes?.it,
          en: directive.attributes?.en,
        }
      }).filter(obj => JSON.stringify(obj) !== '{}')
    })
    .use(remarkStringify)
    .process(content)

  // TODO someday - instead of making phrases an array of strings, make it an array of phrase_ids
  // const dbOrOptionsArray = phraseStringObjects.map(pso => {
  //   let optionString = ''
  //   if (pso.it && pso.it.length > 0) optionString += `content_ita.eq.${pso.it},`
  //   if (pso.en && pso.en.length > 0) optionString += `content_eng.eq.${pso.en},`
  //   // `content_eng_alts.in.(blue,light blue)`,
  //   // `content_ita_alts.in.(scuzi,mi scusi)`,
  //   return optionString
  // })

  // const dbOrOptions = dbOrOptionsArray.join()
  // console.log('  dbOrOptions', dbOrOptions)

  // const { data: phrases, error } = await supabase.from('phrases')
  //   // .select('id')
  //   .select()
  //   .or(dbOrOptions)

  // // ERROR - could not find array type for data type text[], maybe because we need a db update?
  // if (error) {
  //   throw new Error(`Could not query phrases in lesson ${sort_order}`, error)
  // }

  const allPhrases = phraseStringObjects.map(pso => pso.ita)
  const phrases = allPhrases.filter(p => p)

  console.log('  Got phrases from lesson: ', JSON.stringify(phrases).slice(0, 50))

  return phrases
}

const updateDatabase = async lessons => {

  if (DRY_RUN) {
    console.log('Dry run, skipping db update')
    return
  }

  console.log('  Connecting to database')
  const client = new Client({ connectionString: CONNECTION_STRING })
  await client.connect()

  console.log('  Adding new lessons')

  const lessonQueries = lessons.map(async lesson => {

    if (!Array.isArray(lesson.phrases)) {
      throw new Error('lesson.phrases is not an array', lesson.phrases)
    }
    if (!Array.isArray(lesson.topics)) {
      throw new Error('lesson.topics is not an array', lesson.topics)
    }
    const dbPhrases = prepareArrayForDb(lesson.phrases)
    const dbTopics = prepareArrayForDb(lesson.topics)

    // add the lesson
    console.log(`  Adding lesson: ${lesson.title_eng}`)
    const lessonValues = [
      LANGUAGE_CODE,
      lesson.title_eng,
      lesson.title_ita,
      lesson.slug,
      lesson.sort_order,
      lesson.unit,
      new Date(),
      SEED_USER_ID,
    ]
    const lessonQuery = `
      INSERT INTO lessons(language_id, title_eng, title_ita, slug, sort_order, unit, created_at, created_by)
      VALUES($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id
    `
    const lessonResult = await client.query(lessonQuery, lessonValues)

    // add the lesson edit
    console.log(`  Adding lesson edit: ${lesson.title_eng}`)
    const lessonId = lessonResult.rows[0].id
    const lessonEditValues = [
      LANGUAGE_CODE,
      lessonId,
      lesson.content,
      dbPhrases,
      dbTopics,
      new Date(),
      SEED_USER_ID,
    ]
    const lessonEditQuery = `
      INSERT INTO lesson_edits(language_id, lesson_id, content_eng, phrase_strings_ita, topics, created_at, created_by)
      VALUES($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `
    const lessonEditResult = await client.query(lessonEditQuery, lessonEditValues)

    // go back and update the original lesson with the current edit
    // seems to always be the same as the lesson id, but just in case
    const lessonEditId = lessonEditResult.rows[0].id
    const lessonValues2 = [
      lessonEditId,
      lessonId,
    ]
    const lessonEditQuery2 = `
      update lessons set current_edit = $1 where id = $2
    `
    await client.query(lessonEditQuery2, lessonValues2)
  })

  // TODO - run in batches!
  for(const query of lessonQueries) {
    await query
  }

  await client.end()
}

const prepareArrayForDb = array => {
  if (!array || array.length < 1) return null
  return `{${array.join(',')}}`
}

updateLessons()
