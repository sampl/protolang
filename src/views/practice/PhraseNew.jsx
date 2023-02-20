import { useState } from 'react'
import { useParams } from 'react-router-dom'

import { useUser } from '@/_state/user'
import { supabase } from '@/db/supabase'
import Modal from '@/styles/Modal'

export default ({ it, en }) => {
  const { user } = useUser()
  const { langId } = useParams()

  const [phraseCreatorIsOpen, setPhraseCreatorIsOpen] = useState(false)
  const [contentIt, setContentIt] = useState(it || '')
  const [contentEn, setContentEn] = useState(en || '')
  const [saving, setSaving] = useState(false)

  async function submit( event ) {
    event.preventDefault()
    event.stopPropagation()

    try {
      setSaving(true)
      const newData = {
        language_id: langId,
        content_it: contentIt,
        content_en: contentEn,
        // en_alts: enAlts,
        // it_alts: itAlts,
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
      alert(error.message)
    }
  }

  return <>
    <button type="button" onClick={() => setPhraseCreatorIsOpen(true)}>Add phrase</button>

    <Modal isOpen={phraseCreatorIsOpen} onClose={() => setPhraseCreatorIsOpen(false)}>

      <form onSubmit={submit}>
        <h2>New phrase</h2>

        <label htmlFor="contentIt">Italian</label>
        <textarea
          id="contentIt"
          value={contentIt}
          placeholder=""
          onChange={e => setContentIt(e.target.value)}
          required
        />

        <label htmlFor="contentEn">English</label>
        <textarea
          id="contentEn"
          value={contentEn}
          placeholder=""
          onChange={e => setContentEn(e.target.value)}
          required
        />

        <br />

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
