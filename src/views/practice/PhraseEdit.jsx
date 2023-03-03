import { useState } from 'react'

import { supabase } from '@/db/supabase'
import Modal from '@/styles/Modal'
import { logError } from '../../_util/error.js'

export default ({ phrase, float }) => {

  const [phraseEditorIsOpen, setPhraseEditorIsOpen] = useState(false)
  const [contentIta, setContentIta] = useState(phrase.content_ita || '')
  const [itAlts, setItAlts] = useState(phrase.content_ita_alts || [])
  const [contentEn, setContentEn] = useState(phrase.content_eng || '')
  const [enAlts, setEnAlts] = useState(phrase.content_eng_alts || [])
  const [saving, setSaving] = useState(false)

  async function submit( event ) {
    event.preventDefault()
    try {
      setSaving(true)
      const newData = {
        content_ita: contentIta,
        content_eng: contentEn,
        content_ita_alts: itAlts,
        content_eng_alts: enAlts,
      }

      const { error } = await supabase
        .from('phrases')
        .update(newData)
        .eq('id', phrase.id)

      if (error) {
        throw error
      }
      setPhraseEditorIsOpen(false)
    } catch (error) {
      setSaving(false)
      logError('edit phrase', error)
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
    <button type="button" onClick={() => setPhraseEditorIsOpen(true)} style={{float: float && 'right'}}>edit</button>

    <Modal
      title="Edit phrase"
      isOpen={phraseEditorIsOpen}
      onClose={() => setPhraseEditorIsOpen(false)}
    >
      <form onSubmit={submit} key={phrase.id}>
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

        <button className="button" type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save phrase'}
        </button>
      </form>
    </Modal>
  </>
}
