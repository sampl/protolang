import { useState } from 'react'

import { supabase } from '@/db/supabase'
import Modal from '@/styles/Modal'

export default ({ phrase }) => {

  const [phraseEditorIsOpen, setPhraseEditorIsOpen] = useState(false)
  const [contentIt, setContentIt] = useState(phrase.content_it || '')
  const [itAlts, setItAlts] = useState(phrase.it_alts || [])
  const [contentEn, setContentEn] = useState(phrase.content_en || '')
  const [enAlts, setEnAlts] = useState(phrase.en_alts || [])
  const [saving, setSaving] = useState(false)

  async function submit( event ) {
    event.preventDefault()
    try {
      setSaving(true)
      const newData = {
        content_it: contentIt,
        content_en: contentEn,
        it_alts: itAlts,
        en_alts: enAlts,
      }

      const { error } = await supabase
        .from('phrases')
        .update(newData)
        .eq('id', phraseId)

      if (error) {
        throw error
      }
      setPhraseEditorIsOpen(false)
    } catch (error) {
      setSaving(false)
      alert(error.message)
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
    <button type="button" onClick={() => setPhraseEditorIsOpen(true)}>edit</button>

    <Modal isOpen={phraseEditorIsOpen} onClose={() => setPhraseEditorIsOpen(false)}>
      <form onSubmit={submit} key={phrase.id}>
        <h2>Edit phrase</h2>

        <label htmlFor="contentIt">Italian</label>
        <textarea
          style={{height: '50px'}}
          id="contentIt"
          value={contentIt}
          placeholder=""
          onChange={e => setContentIt(e.target.value)}
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

        <button type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save phrase'}
        </button>
      </form>
    </Modal>
  </>
}
