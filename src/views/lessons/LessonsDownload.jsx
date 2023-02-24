import { useState } from 'react'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

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

    if (error) {
      alert('Sorry, could not download lessons right now. Try again later?')
      console.error(error)
      return
    }

    // generate object of markdown files
    console.log('generating lessonFiles')
    const lessonFiles = lessons.map(lesson => {
      const hasTopics = lesson.current_edit?.topics && lesson.current_edit?.topics.length >= 0
      const topics = hasTopics ? ` - (${lesson.current_edit?.topics.join(', ')})` : ''
      return {
        name: `Unit ${lesson.unit || 0} - #${lesson.sort_order || 0} - ${lesson.title_en}${topics}.md`,
        content: lesson.current_edit?.content_en || '',
      }
    })

    // TODO - append CC license here

    // make zip file
    console.log('zipping lessonFiles', lessonFiles)
    const zip = new JSZip()
    lessonFiles.forEach( (file, index) => zip.file(file.name, file.content))
    const zipFile = await zip.generateAsync({ type: 'blob' })

    // save file
    console.log('saving lessonFiles')
    // https://stackoverflow.com/a/9456144
    const timestamp = Math.floor(new Date() / 1000)
    saveAs(zipFile, `Protolang lessons (${LANG_CODE.toUpperCase()}) - ${timestamp}.zip`)

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
