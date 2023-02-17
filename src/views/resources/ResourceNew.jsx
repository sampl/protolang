import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { useUser } from '@/_state/user'
import { supabase } from '@/db/supabase'

export default () => {
  const { user } = useUser()
  const { langId } = useParams()
  const navigate = useNavigate()

  const [url, setUrl] = useState('')
  const [saving, setSaving] = useState(false)

  async function submit( event ) {
    event.preventDefault()
    try {
      setSaving(true)

      const newData = {
        language_id: langId,
        url,
        created_by: user.id,
      }

      const { data: newResource, error } = await supabase
        .from('resources')
        .insert([newData])

      if (error) {
        throw error
      }
      navigate(`/${langId}/resources/${newResource[0].id}`)
    } catch (error) {
      setSaving(false)
      alert(error.message)
    }
  }

  return <form onSubmit={submit}>
    <h2>New resource</h2>

    <label htmlFor="url">What's the url?</label>
    <input
      id="url"
      type="url"
      value={url}
      placeholder="https://yourlink.here"
      onChange={e => setUrl(e.target.value)}
    />

    <br />

    <button
      type="submit"
      disabled={saving}
    >
      {saving ? 'Adding...' : 'Add resource'}
    </button>
  </form>
}
