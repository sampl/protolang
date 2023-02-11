import JSZip from 'jszip'
import { saveAs } from 'file-saver'

import { useLanguage } from '@/_state/language'
import { supabase } from '@/_util/supabaseClient'

export default () => {
  const { currentLanguage } = useLanguage()

  const downloadAll = async () => {

    // get lessons
    console.log('getting lessons')
    const { data: lessons, error } = await supabase
      .from('lessons')
      .select()
      .eq('language', currentLanguage.id)
    
    if (error) {
      alert('Sorry, could not download lessons right now. Try again later?')
      console.error(error)
      return
    }

    // generate object of markdown files
    console.log('generating lessonFiles')
    const lessonFiles = lessons.map(lesson => ({
      name: `${lesson.title_en}.md`, // TODO - add sort order here
      content: lesson.content_en,
    }))

    // make zip file
    console.log('zipping lessonFiles', lessonFiles)
    const zip = new JSZip()
    lessonFiles.forEach( (file, index) => zip.file(file.name, file.content))
    const zipFile = await zip.generateAsync({ type: 'blob' })
    
    // save file
    console.log('saving lessonFiles')
    saveAs(zipFile, `Protolang lessons (${currentLanguage.id.toUpperCase()}).zip`)
  }

  return <div>
    <hr />
    <p style={{fontSize: 'small'}}>Lessons are free to use under a Creative Commons license (coming soon)</p>
    <button onClick={downloadAll}>Download all</button>
  </div>
}