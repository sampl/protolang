import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import { supabase, useSupabaseQuery } from '@/db/supabase'
import mediaTypes from '@/consts/mediaTypes'

export default () => {
  const { langId, mediaId } = useParams()
  const navigate = useNavigate()

  const [url, setURL] = useState('')
  const [type, setType] = useState({})
  const [saving, setSaving] = useState(false)

  const mediaQuery = supabase
    .from('media')
    .select()
    .eq('id', mediaId)
    .single()
  const [media, mediaLoading, mediaError] = useSupabaseQuery(mediaQuery, [mediaId])

  // all this crap should go away when we start using a backend
  useEffect(() => {
    if (media) {
      setURL(media.url)
      setType(media.type)
    }
  }, [media])

  async function submit( event ) {
    event.preventDefault()
    try {
      setSaving(true)
      const newData = {
        url,
        media_type: type,
      }

      const { error } = await supabase
        .from('media')
        .update(newData)
        .eq('id', mediaId)

      if (error) {
        throw error
      }
      navigate(`/${langId}/media/${mediaId}`)
    } catch (error) {
      setSaving(false)
      alert(error.message)
    }
  }

  if (mediaError) return mediaError.message
  if (mediaLoading) return 'loading...'

  return <form onSubmit={submit}>
    <h2>Edit media</h2>

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

    <label htmlFor="url">URL</label>
    <input
      type="url"
      id="url"
      value={url}
      placeholder=""
      onChange={e => setURL(e.target.value)}
      required
    />

    <br />

    <button type="submit" disabled={saving}>
      {saving ? 'Saving...' : 'Save media'}
    </button>
  </form>
}
