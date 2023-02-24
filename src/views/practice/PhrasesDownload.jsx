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

    // get phrases
    console.log('getting phrases')
    const { data: phrases, error } = await supabase
      .from('phrases')
      .select('*')
      .eq('language_id', LANG_CODE)

    if (error) {
      alert('Sorry, could not download phrases right now. Try again later?')
      console.error(error)
      return
    }

    // generate object of markdown files
    console.log('generating phraseFiles')
    const phraseFiles = phrases.map(phrase => ({
      name: `Phrase ID ${phrase.id || 0} - ${phrase.content_ita}.md`,
      content: [
        phrase.id,
        phrase.language_id,
        phrase.content_ita,
        phrase.content_ita_alts ? phrase.content_ita_alts.join('\t') : '',
        phrase.content_eng,
        phrase.content_eng_alts ? phrase.content_eng_alts.join('\t') : '',
      ].join('\n'),
    }))
  
    // TODO - append CC license here

    // make zip file
    console.log('zipping phraseFiles', phraseFiles)
    const zip = new JSZip()
    phraseFiles.forEach( (file, index) => zip.file(file.name, file.content))
    const zipFile = await zip.generateAsync({ type: 'blob' })

    // save file
    console.log('saving phraseFiles')
    // https://stackoverflow.com/a/9456144
    const timestamp = Math.floor(new Date() / 1000)
    saveAs(zipFile, `Protolang phrases (${LANG_CODE.toUpperCase()}) - ${timestamp}.zip`)

    setDownloadingState('done')
  }

  return <button disabled={downloadingState === 'working' || downloadingState === 'done'} onClick={downloadAll}>
    {
      downloadingState === 'ready' ? 'Download all phrases' :
      downloadingState === 'working' ? 'Downloading...' :
      downloadingState === 'done' ? 'Done!' :
      'Error'
    }
  </button>
}
