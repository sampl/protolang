import { useState } from 'react'
import { useParams } from 'react-router-dom'

import { useUser } from '@/_state/user'
import { supabase } from '@/_util/supabaseClient'

export default () => {
  const { user } = useUser()
  const { lang: urlLang } = useParams()

  const [url, setUrl] = useState('')
  const [saving, setSaving] = useState(false)

  async function submit( event ) {
    event.preventDefault()
    try {
      setSaving(true)

      const newData = {
        language: 'lang_'+urlLang,
        url,
        created_at: new Date(),
        created_by: user.id,
      }

      let { error } = await supabase.from('resources').insert([newData])

      if (error) {
        throw error
      }
    } catch (error) {
      alert(error.message)
    } finally {
      setSaving(false)
      setUrl('')
    }
  }

  return <form onSubmit={submit}>
    <h2>New resource</h2>

    <label for="url">What's the url?</label>
    <input
      id="url"
      type="url"
      value={url}
      placeholder="https://..."
      onChange={e => setUrl(e.target.value)}
    />

    <button
      type="submit"
      disabled={saving}
    >
      {saving ? 'Adding...' : 'Add resource'}
    </button>
  </form>
}
