import { useState } from 'react'
import { useParams } from 'react-router-dom'

import { useUser } from '@/_state/user'
import { supabase } from '@/db/supabase'
import Modal from '@/styles/Modal'
import { logError } from '../../_util/error.js'

export default ({ it, en }) => {
  const { user } = useUser()
  const { langId } = useParams()

  const [phraseCreatorIsOpen, setPhraseCreatorIsOpen] = useState(false)
  const [contentIta, setContentIta] = useState(it || '')
  const [itAlts, setItAlts] = useState([])
  const [contentEn, setContentEn] = useState(en || '')
  const [enAlts, setEnAlts] = useState([])
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
        content_eng_alts: enAlts,
        content_ita_alts: itAlts,
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
    const originalArray = lang === 'it' ? itAlts : enAlts
    const updateFunction = lang === 'it' ? setItAlts : setEnAlts
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
        {(!itAlts || itAlts.length < 1) ? 'no Italian alternates' : itAlts.map((alt, index) => {
          return <div key={index}>
            <textarea
              style={{height: '50px'}}
              type="text"
              value={alt}
              onChange={e => updateAlt('it', { index, value: e.target.value})}
            />
            {/* https://stackoverflow.com/a/47024021 */}
            <button type="button" onClick={() => setItAlts([...itAlts.slice(0, index), ...itAlts.slice(index + 1)])}>Delete</button>
          </div>
        })}
        <br />
        <button type="button" onClick={() => setItAlts([...itAlts, ''])}>Add alternate</button>

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
        {(!enAlts || enAlts.length < 1) ? 'no English alternates' : enAlts.map((alt, index) => {
          return <div key={index}>
            <textarea
              style={{height: '50px'}}
              type="text"
              value={alt}
              onChange={e => updateAlt('en', { index, value: e.target.value})}
            />
            {/* https://stackoverflow.com/a/47024021 */}
            <button type="button" onClick={() => setEnAlts([...enAlts.slice(0, index), ...enAlts.slice(index + 1)])}>Delete</button>
          </div>
        })}
        <br />
        <button type="button" onClick={() => setEnAlts([...enAlts, ''])}>Add alternate</button>

        <hr />

        <button
          type="submit"
          disabled={saving}
        >
          {saving ? 'Adding...' : 'Add phrase'}
        </button>
      </form>

    </Modal>
  </>
}
