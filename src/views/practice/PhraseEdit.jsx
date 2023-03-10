import { useState } from 'react'

import { supabase } from '@/db/supabase'
import Modal from '@/styles/Modal'
import { logError } from '../../_util/error.js'
import TranslateHelper from '../dictionary/TranslateHelper.jsx'

export default ({ phrase, float }) => {

  const [phraseEditorIsOpen, setPhraseEditorIsOpen] = useState(false)
  const [contentIta, setContentIta] = useState(phrase.content_ita || '')
  const [itaAlts, setItaAlts] = useState(phrase.content_ita_alts || [])
  const [contentEng, setContentEng] = useState(phrase.content_eng || '')
  const [engAlts, setEngAlts] = useState(phrase.content_eng_alts || [])
  const [saving, setSaving] = useState(false)

  async function submit( event ) {
    event.preventDefault()
    try {
      setSaving(true)
      const newData = {
        content_ita: contentIta,
        content_eng: contentEng,
        content_ita_alts: itaAlts,
        content_eng_alts: engAlts,
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
    const originalArray = lang === 'it' ? itaAlts : engAlts
    const updateFunction = lang === 'it' ? setItaAlts : setEngAlts
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
        <TranslateHelper eng={contentEng} />

        <label>Italian alternates</label>
        {(!itaAlts || itaAlts.length < 1) ? 'no Italian alternates' : itaAlts.map((alt, index) => {
          return <div key={index}>
            <textarea
              style={{height: '50px'}}
              type="text"
              value={alt}
              onChange={e => updateAlt('it', { index, value: e.target.value})}
            />
            {/* https://stackoverflow.com/a/47024021 */}
            <button type="button" onClick={() => setItaAlts([...itaAlts.slice(0, index), ...itaAlts.slice(index + 1)])}>Delete</button>
          </div>
        })}
        <br />
        <button type="button" onClick={() => setItaAlts([...itaAlts, ''])}>Add alternate</button>

        <label htmlFor="contentEng">English</label>
        <textarea
          style={{height: '50px'}}
          id="contentEng"
          value={contentEng}
          placeholder=""
          onChange={e => setContentEng(e.target.value)}
          required
        />
        <TranslateHelper ita={contentIta} />

        <label>English alternates</label>
        {(!engAlts || engAlts.length < 1) ? 'no English alternates' : engAlts.map((alt, index) => {
          return <div key={index}>
            <textarea
              style={{height: '50px'}}
              type="text"
              value={alt}
              onChange={e => updateAlt('en', { index, value: e.target.value})}
            />
            {/* https://stackoverflow.com/a/47024021 */}
            <button type="button" onClick={() => setEngAlts([...engAlts.slice(0, index), ...engAlts.slice(index + 1)])}>Delete</button>
          </div>
        })}
        <br />
        <button type="button" onClick={() => setEngAlts([...engAlts, ''])}>Add alternate</button>

        <hr />

        <button className="button" type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save phrase'}
        </button>
      </form>
    </Modal>
  </>
}
