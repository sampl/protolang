import * as pg from 'pg'
const { Client } = pg

import { promises as fs } from 'fs'
import dotenv from 'dotenv'

import {unified} from 'unified'
import remarkParse from 'remark-parse'
import remarkFrontmatter from 'remark-frontmatter'
import remarkStringify from 'remark-stringify'
// import remarkDirective from 'remark-directive'
import remarkParseYaml from 'remark-parse-yaml'

import { dirname } from 'path'
import { fileURLToPath } from 'url'
const __dirname = dirname(fileURLToPath(import.meta.url))

dotenv.config()
const CONNECTION_STRING = process.env.ADMIN_POSTGRES_CONNECTION_STRING

const myArgs = process.argv.slice(2)
const LIVE = myArgs[0] === '--live'
const DESTRUCTIVE = myArgs[1] === '--destructive'

const LANGUAGE_CODE = 'it'
const LESSONS_FILE_PATH = `/../../language_data/${LANGUAGE_CODE}/lessons/`

const updateLessons = async() => {
  try {
    const lessonFiles = await getLessonFileContent(LESSONS_FILE_PATH)
    const parsedLessons = await Promise.all(lessonFiles.map(parseLesson))
    return updateDatabase(parsedLessons)
  } catch (error) {
    console.error(error)
  }
}

const getLessonFileContent = async relativePath => {
  const absolutePath = __dirname + relativePath
  const filenames = await fs.readdir(absolutePath)
  return Promise.all(filenames.map(async filename => {
    const content = await fs.readFile(absolutePath + filename, 'utf-8')
    return { filename, content }
  }))
}

const parseLesson = async ({ filename, content }) => {

  let frontMatter
  await unified()
    .use(remarkParse)
    .use(remarkFrontmatter)
    .use(remarkParseYaml)
    .use(remarkStringify)
    .use(() => tree => {
      const yamlNode = tree.children.find(n => n.type === 'yaml')
      frontMatter = yamlNode?.data?.parsedValue
    })
    .process(content)

  // let directiveWords
  // const parsedLessonContent = await unified()
  //   .use(remarkParse)
  //   .use(remarkDirective)
  //   .use(() => tree => {
  //     const allSubChildren = tree?.children.map(c => c.children || []).flat()
  //     const directives = allSubChildren.filter(c => c.type.includes('Directive'))
  //     directiveWords = {
  //       it: directives.map(directive => directive.attributes?.it).filter(word => !!word),
  //       en: directives.map(directive => directive.attributes?.en).filter(word => !!word),
  //     }
  //   })
  //   .use(remarkFrontmatter)
  //   .use(remarkStringify)
  //   .process(content)

  // TODO - get markdown content from lesson

  const { content_en } = parsedLessonContent

  const order = filename.startsWith('L1') ? 10 :
                filename.startsWith('L2') ? 20 :
                filename.startsWith('L3') ? 30 :
                                            100

  return {
    language: `lang_${LANGUAGE_CODE}`,
    title_en: frontMatter.title,
    content_en: content_en,
    updated_on: new Date(),
    order,
    // directive_words: directiveWords,
  }
}

// TODO - remove "completed" lesson attr and add a view that shows percentage lessons completed based on vocab
// TODO - add directive words to db
const updateDatabase = async lessons => {

  console.dir(lessons)
  
  if (!LIVE) {
    console.log('Skipping db update, to run it for real use "--live"')
    return
  }

  const client = new Client({ connectionString: CONNECTION_STRING })
  await client.connect()

  // clear out previous data
  if (DESTRUCTIVE) {
    console.log('--destructive flag detected, removing existing lessons...')
    await client.query('DELETE FROM lessons;')
  }

  await Promise.all(lessons.map(async lesson => {
    const text = 'INSERT INTO lessons(language, title_en, content_en, updated_on, order) VALUES($1, $2, $3, $4, $5) RETURNING *'
    await client.query(text, lesson)
  }))

  await client.end()
}

updateLessons()
