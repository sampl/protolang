import { useState } from 'react'
import { useParams } from 'react-router-dom'

import { useUser } from '@/_state/user'
import { supabase } from '@/_util/supabaseClient'

// keep in sync with the database enums
const MEDIA_TYPES = [
  {
    id: 'book',
    label: 'Book',
  },
  {
    id: 'article',
    label: 'Article',
  },
  {
    id: 'podcast',
    label: 'Podcast',
  },
  {
    id: 'video',
    label: 'Video',
  },
  {
    id: 'tv_show',
    label: 'TV show',
  },
  {
    id: 'film',
    label: 'Film',
  },
  {
    id: 'other',
    label: 'Other',
  },
]

export default () => {
  const { user } = useUser()
  const { lang: urlLang } = useParams()

  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [type, setType] = useState(MEDIA_TYPES[0].id)
  const [saving, setSaving] = useState(false)

  async function submit( event ) {
    event.preventDefault()
    debugger
    try {
      setSaving(true)

      const newData = {
        language: urlLang,
        name,
        url,
        type,
        created_by: user.id,
      }

      let { error } = await supabase.from('media').insert([newData])

      if (error) {
        throw error
      }
      console.log('saved')
    } catch (error) {
      alert(error.message)
    } finally {
      setSaving(false)
      setName('')
      setUrl('')
    }
  }

  return <form onSubmit={submit}>
    <h2>New media item</h2>

    <label htmlFor="name">Name</label>
    <input
      id="name"
      type="text"
      value={name}
      placeholder=""
      onChange={e => setName(e.target.value)}
      required
    />

    <label htmlFor="type">Type</label>
    <select
      value={type}
      onChange={e => setType(e.target.value)}
      required
    >
      {MEDIA_TYPES.map(mediaType => {
        return <option key={mediaType.id} value={mediaType.id}>{mediaType.label}</option>
      })}
    </select>

    <label htmlFor="url">What's the url?</label>
    <input
      id="url"
      type="url"
      value={url}
      placeholder="https://..."
      onChange={e => setUrl(e.target.value)}
      required
    />

    <br />

    <button
      type="submit"
      disabled={saving}
    >
      {saving ? 'Adding...' : 'Add media item'}
    </button>
  </form>
}
