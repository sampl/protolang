import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import { supabase, useSupabaseQuery } from '@/db/supabase'

export default () => {
  const { langId, resourceId } = useParams()
  const navigate = useNavigate()

  const [url, setURL] = useState('')
  const [saving, setSaving] = useState(false)

  const resourceQuery = supabase
    .from('resources')
    .select()
    .eq('id', resourceId)
    .single()
  const [resource, resourceLoading, resourceError] = useSupabaseQuery(resourceQuery, [resourceId])

  // all this crap should go away when we start using a backend
  useEffect(() => {
    if (resource) {
      setURL(resource.url)
    }
  }, [resource])

  async function submit( event ) {
    event.preventDefault()
    try {
      setSaving(true)
      const newData = {
        url,
      }

      const { error } = await supabase
        .from('resources')
        .update(newData)
        .eq('id', resourceId)

      if (error) {
        throw error
      }
      navigate(`/${langId}/resource/${resourceId}`)
    } catch (error) {
      setSaving(false)
      alert(error.message)
    }
  }

  if (resourceError) return resourceError.message
  if (resourceLoading) return 'loading...'

  return <form onSubmit={submit}>
    <h2>Edit resource</h2>

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
      {saving ? 'Saving...' : 'Save resource'}
    </button>
  </form>
}
