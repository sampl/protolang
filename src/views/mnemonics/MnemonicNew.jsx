import { useState } from 'react'

import { useUser } from '@/_state/user'
import { supabase } from '@/db/supabase'
import { useLanguage } from '@/_state/language'

export default ({ string }) => {
  const { user } = useUser()
  const { currentLanguage } = useLanguage()

  const [rememberMethod, setRememberMethod] = useState('')
  const [saving, setSaving] = useState(false)

  async function addMnemonic( event ) {
    event.preventDefault()
    try {
      setSaving(true)

      const newData = {
        language_id: currentLanguage.id,
        target_phrase: string,
        remember_method: rememberMethod,
        created_by: user.id,
      }

      const { error } = await supabase
        .from('mnemonics')
        .insert([newData])

      if (error) {
        throw error
      }
      location.reload()
    } catch (error) {
      setSaving(false)
      alert(error.message)
    }
  }

  return <form onSubmit={addMnemonic}>
    <textarea
      id="content"
      value={rememberMethod}
      placeholder="How do you remember this word?"
      onChange={e => setRememberMethod(e.target.value)}
    />

    <br />

    <button
      type="submit"
      disabled={saving}
    >
      {saving ? 'Adding...' : 'Add'}
    </button>
  </form>
}
