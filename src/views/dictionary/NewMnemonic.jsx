import { useState } from 'react'

import { useUser } from '@/_state/user'
import { supabase } from '@/_util/supabaseClient'
import { useLanguage } from '@/_state/language'

export default ({ string }) => {
  const { user } = useUser()
  const { currentLanguage } = useLanguage()

  const [newMnemonic, setNewMnemonic] = useState('')
  const [saving, setSaving] = useState(false)

  async function addMnemonic( event ) {
    event.preventDefault()
    try {
      setSaving(true)

      const newData = {
        language: currentLanguage.id,
        target_phrase: string,
        remember_method: newMnemonic,
        created_by: user.id,
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
    <br />
    <button
      type="submit"
      disabled={saving}
    >
      {saving ? 'Submitting...' : 'Submit'}
    </button>
  </form>
}
