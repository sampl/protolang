import { useState } from 'react'

import { useUser } from '@/_state/user'
import { supabase } from '@/_util/supabaseClient'

export default function NewMnemonic({ wordId }) {
  const { user } = useUser()

  const [newMnemonic, setNewMnemonic] = useState('')
  const [saving, setSaving] = useState(false)

  async function addMnemonic( event ) {
    event.preventDefault()
    try {
      setSaving(true)

      const newData = {
        created_by: user.id,
        word: wordId,
        content_en: newMnemonic,
      }

      let { error } = await supabase.from('mnemonics').insert([newData])

      if (error) {
        throw error
      }
    } catch (error) {
      alert(error.message)
    } finally {
      setSaving(false)
      setNewMnemonic('')
    }
  }

  return <form onSubmit={addMnemonic}>
    <textarea
      id="content"
      value={newMnemonic}
      placeholder="How do you remember this word?"
      onChange={e => setNewMnemonic(e.target.value)}
    />

    <button
      type="submit"
      disabled={saving}
    >
      {saving ? 'Submitting...' : 'Submit'}
    </button>
  </form>
}
