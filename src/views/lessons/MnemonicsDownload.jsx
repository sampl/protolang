import { useState } from 'react'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

import { supabase } from '@/db/supabase'
import { groupBy } from 'lodash'

// TODO - other languages
const LANG_CODE = 'it'

export default () => {

  // ready, working, done
  const [downloadingState, setDownloadingState] = useState('ready')

  const downloadAll = async () => {

    setDownloadingState('working')

    // get mnemonics
    console.log('getting mnemonics')
    const { data: mnemonics, error } = await supabase
      .from('mnemonics')
      .select()
      .eq('language_id', LANG_CODE)

    if (error) {
      alert('Sorry, could not download mnemonics right now. Try again later?')
      console.error(error)
      return
    }

    const mnemonicGroups = groupBy(mnemonics, 'target_phrase')

    // generate object of markdown files
    console.log('generating mnemonicsFiles')
    const mnemonicsFiles = Object.keys(mnemonicGroups).map(key => {
      return {
        name: `${key}.md`,
        content: mnemonicGroups[key].map(mnemonic => `${mnemonic.remember_method}\t${mnemonic.created_by}`).join('\n'),
      }
    })

    // TODO - append CC license here

    // make zip file
    console.log('zipping mnemonicsFiles', mnemonicsFiles)
    const zip = new JSZip()
    mnemonicsFiles.forEach( (file, index) => zip.file(file.name, file.content))
    const zipFile = await zip.generateAsync({ type: 'blob' })

    // save file
    console.log('saving mnemonicsFiles')
    // https://stackoverflow.com/a/9456144
    const timestamp = Math.floor(new Date() / 1000)
    saveAs(zipFile, `Protolang mnemonics (${LANG_CODE.toUpperCase()}) - ${timestamp}.zip`)

    setDownloadingState('done')
  }

  return <button disabled={downloadingState === 'working' || downloadingState === 'done'} onClick={downloadAll}>
    {
      downloadingState === 'ready' ? 'Download all mnemonics' :
      downloadingState === 'working' ? 'Downloading...' :
      downloadingState === 'done' ? 'Done!' :
      'Error'
    }
  </button>
}
