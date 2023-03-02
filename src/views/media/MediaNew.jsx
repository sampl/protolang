import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { useUser } from '@/_state/user'
import { supabase } from '@/db/supabase'
import mediaTypes from '@/consts/mediaTypes'
import { logError } from '../../_util/error.js'

export default () => {
  const { user } = useUser()
  const { langId } = useParams()
  const navigate = useNavigate()

  const [url, setUrl] = useState('')
  const [type, setType] = useState(mediaTypes[0].id)
  const [saving, setSaving] = useState(false)

  async function submit( event ) {
    event.preventDefault()
    try {
      setSaving(true)

      const newData = {
        language_id: langId,
        url,
        media_type: type,
        created_by: user.id,
      }

      const { data: newMedia, error } = await supabase
        .from('media')
        .insert([newData])
        .select()

      if (error) {
        throw error
      }
      navigate(`/${langId}/media/${newMedia[0].id}`)
    } catch (error) {
      setSaving(false)
      logError('create media', error)
    }
  }

  return <form onSubmit={submit}>
    <h2>New media item</h2>

    <label htmlFor="type">Type</label>
    <select
      value={type}
      onChange={e => setType(e.target.value)}
      required
    >
      {mediaTypes.map(mediaType => {
        return <option key={mediaType.id} value={mediaType.id}>{mediaType.label}</option>
      })}
    </select>

    <label htmlFor="url">What's the url?</label>
    <input
      id="url"
      type="url"
      value={url}
      placeholder="https://yourlink.here"
      onChange={e => setUrl(e.target.value)}
      required
    />

    <br />

    <button
      className="button"
      type="submit"
      disabled={saving}
    >
      {saving ? 'Adding...' : 'Add media item'}
    </button>
  </form>
}
