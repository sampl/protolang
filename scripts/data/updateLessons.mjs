import pg from 'pg'
const Client = pg.Client

import { promises as fs } from 'fs'
import dotenv from 'dotenv'

import {unified} from 'unified'
import remarkParse from 'remark-parse'
import remarkFrontmatter from 'remark-frontmatter'
import remarkStringify from 'remark-stringify'
import remarkDirective from 'remark-directive'
import remarkParseYaml from 'remark-parse-yaml'
import { filter } from 'unist-util-filter'

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

  let directiveWords
  await unified()
    .use(remarkParse)
    .use(remarkDirective)
    .use(() => tree => {
      const allSubChildren = tree?.children.map(c => c.children || []).flat()
      const directives = allSubChildren.filter(c => c.type.includes('Directive'))
      // TODO - translate english-only directives to italian
      directiveWords = directives.map(directive => directive.attributes?.it || directive.attributes?.en).filter(word => !!word)
    })
    .use(remarkFrontmatter)
    .use(remarkStringify)
    .process(content)

  // https://github.com/remarkjs/remark/blob/main/packages/remark-stringify/readme.md#use
  let markdownContent = await unified()
    .use(remarkParse)
    .use(remarkFrontmatter)
    .use(() => tree => filter(tree, node => node.type !== 'yaml'))
    .use(remarkStringify)
    .process(content)
  const markdownContentString = String(markdownContent)

  const order = filename.startsWith('L1') ? 10 :
                filename.startsWith('L2') ? 20 :
                filename.startsWith('L3') ? 30 :
                                            100

  return {
    language: `lang_${LANGUAGE_CODE}`,
    title_en: frontMatter.title,
    content_en: markdownContentString,
    updated_on: new Date(),
    order,
    words: JSON.stringify(directiveWords),
  }
}

// TODO - lessons getting added multiple times
const updateDatabase = async lessons => {

  // console.dir(lessons)

  if (!LIVE) {
    console.log('Skipping db update, to run it for real use "--live"')
    return
  }

  const client = new Client({ connectionString: CONNECTION_STRING })
  await client.connect()

  // clear out previous data
  if (DESTRUCTIVE) {
    console.log('Removing existing lessons...')
    await client.query('DELETE FROM lessons;')
  }
  
  console.log('Adding new lessons...')
  await Promise.all(lessons.map(async lesson => {
    console.log(lesson.title_en)
    const values = [
      lesson.language,
      lesson.title_en,
      lesson.content_en,
      lesson.updated_on,
      lesson.order,
      lesson.words,
    ]
    const text = `
      INSERT INTO lessons("language", title_en, content_en, created_at, "order", words)
      VALUES($1, $2, $3, $4, $5, json_array_elements($6))
      RETURNING *
    `
    await client.query(text, values)
  }))

  await client.end()
}

updateLessons()