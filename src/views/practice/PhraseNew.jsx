import { useState } from 'react'
import { useParams } from 'react-router-dom'

import { useUser } from '@/_state/user'
import { supabase } from '@/db/supabase'
import Modal from '@/styles/Modal'
import { logError } from '../../_util/error.js'

export default ({ ita, eng }) => {
  const { user } = useUser()
  const { langId } = useParams()

  const [phraseCreatorIsOpen, setPhraseCreatorIsOpen] = useState(false)
  const [contentIta, setContentIta] = useState(ita || '')
  const [itaAlts, setItaAlts] = useState([])
  const [contentEn, setContentEn] = useState(eng || '')
  const [engAlts, setEngAlts] = useState([])
  const [saving, setSaving] = useState(false)

  async function submit( event ) {
    event.preventDefault()
    event.stopPropagation()

    try {
      setSaving(true)
      const newData = {
        language_id: langId,
        content_ita: contentIta,
        content_eng: contentEn,
        content_eng_alts: engAlts,
        content_ita_alts: itaAlts,
        created_by: user.id,
      }

      const { error } = await supabase
        .from('phrases')
        .insert([newData])
        .select()

      if (error) {
        throw error
      }
      // TODO - make sure other pages have reactivity on so they see the update
      setPhraseCreatorIsOpen(false)
    } catch (error) {
      setSaving(false)
      logError('create phrase', error)
    }
  }

  const updateAlt = (lang, { index, value }) => {
    const originalArray = lang === 'ita' ? itaAlts : engAlts
    const updateFunction = lang === 'ita' ? setItaAlts : setEngAlts
    const newArray = [...originalArray]
    newArray[index] = value
    updateFunction(newArray)
  }

  return <>
    <button type="button" onClick={() => setPhraseCreatorIsOpen(true)}>Add phrase</button>

    <Modal isOpen={phraseCreatorIsOpen} onClose={() => setPhraseCreatorIsOpen(false)}>

      <form onSubmit={submit}>
        <h2>New phrase</h2>

        <label htmlFor="contentIta">Italian</label>
        <textarea
          style={{height: '50px'}}
          id="contentIta"
          value={contentIta}
          placeholder=""
          onChange={e => setContentIta(e.target.value)}
          required
        />

        <label>Italian alternates</label>
        {(!itaAlts || itaAlts.length < 1) ? 'no Italian alternates' : itaAlts.map((alt, index) => {
          return <div key={index}>
            <textarea
              style={{height: '50px'}}
              type="text"
              value={alt}
              onChange={e => updateAlt('ita', { index, value: e.target.value})}
            />
            {/* https://stackoverflow.com/a/47024021 */}
            <button type="button" onClick={() => setItaAlts([...itaAlts.slice(0, index), ...itaAlts.slice(index + 1)])}>Delete</button>
          </div>
        })}
        <br />
        <button type="button" onClick={() => setItaAlts([...itaAlts, ''])}>Add alternate</button>

        <label htmlFor="contentEn">English</label>
        <textarea
          style={{height: '50px'}}
          id="contentEn"
          value={contentEn}
          placeholder=""
          onChange={e => setContentEn(e.target.value)}
          required
        />

        <label>English alternates</label>
        {(!engAlts || engAlts.length < 1) ? 'no English alternates' : engAlts.map((alt, index) => {
          return <div key={index}>
            <textarea
              style={{height: '50px'}}
              type="text"
              value={alt}
              onChange={e => updateAlt('eng', { index, value: e.target.value})}
            />
            {/* https://stackoverflow.com/a/47024021 */}
            <button type="button" onClick={() => setEngAlts([...engAlts.slice(0, index), ...engAlts.slice(index + 1)])}>Delete</button>
          </div>
        })}
        <br />
        <button type="button" onClick={() => setEngAlts([...engAlts, ''])}>Add alternate</button>

        <hr />

        <button
          className="button"
          type="submit"
          disabled={saving}
        >
          {saving ? 'Adding...' : 'Add phrase'}
        </button>
      </form>

    </Modal>
  </>
}
