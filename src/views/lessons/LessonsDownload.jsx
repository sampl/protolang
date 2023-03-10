import { useState } from 'react'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import yaml from 'yaml'

import { supabase } from '@/db/supabase'

// TODO - other languages
const LANG_CODE = 'it'

export default () => {

  // ready, working, done
  const [downloadingState, setDownloadingState] = useState('ready')

  const downloadAll = async () => {

    setDownloadingState('working')

    // get lessons
    console.log('getting lessons')
    const { data: lessons, error } = await supabase
      .from('lessons')
      .select('*, current_edit(*)')
      .eq('language_id', LANG_CODE)
      .order('sort_order', { ascending: true })

    if (error) {
      alert('Sorry, could not download lessons right now. Try again later?')
      console.error(error)
      return
    }

    // generate object of markdown files
    console.log('generating lessonFiles')
    const lessonFiles = lessons.map(lesson => {
      const timestamp = Math.floor(new Date() / 1000) // https://stackoverflow.com/a/9456144
      const license = 'Creative commons license coming soon' // TODO - real license
      const { unit, sort_order, title_eng, topics } = lesson
      const metadata = { unit, sort_order, title_eng, timestamp, license }
      if (lesson.title_ita) {
        metadata.title_ita = lesson.title_ita
      }
      if (lesson.current_edit?.topics) {
        metadata.topics = lesson.current_edit.topics
      }
      const metadataYaml = yaml.stringify(metadata)
      const frontmatter = `---\n${metadataYaml}---\n\n`

      return {
        name: `${lesson.unit || 0} - #${lesson.sort_order || 0} - ${lesson.title_eng}.md`,
        content: frontmatter + (lesson.current_edit?.content_eng || ''),
      }
    })

    // make zip file
    console.log('zipping lessonFiles', lessonFiles)
    const zip = new JSZip()
    lessonFiles.forEach(file => zip.file(file.name, file.content))
    const zipFile = await zip.generateAsync({ type: 'blob' })

    // save file
    console.log('saving lessonFiles')
    saveAs(zipFile, `Protolang lessons (${LANG_CODE.toUpperCase()}).zip`)

    setDownloadingState('done')
  }

  return <button disabled={downloadingState === 'working' || downloadingState === 'done'} onClick={downloadAll}>
    {
      downloadingState === 'ready' ? 'Download all lessons' :
      downloadingState === 'working' ? 'Downloading...' :
      downloadingState === 'done' ? 'Done!' :
      'Error'
    }
  </button>
}
