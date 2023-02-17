import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { useUser } from '@/_state/user'
import { supabase } from '@/db/supabase'

export default () => {
  const { user } = useUser()
  const { langId } = useParams()
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [saving, setSaving] = useState(false)

  async function submit( event ) {
    event.preventDefault()
    try {
      setSaving(true)

      const newData = {
        language_id: langId,
        title_en: title,
        slug,
        created_by: user.id,
      }

      const { data: newLesson, error } = await supabase
        .from('lessons')
        .insert([newData])

      if (error) {
        throw error
      }
      navigate(`/${langId}/lessons/${newLesson[0].slug}/edit`)
    } catch (error) {
      setSaving(false)
      alert(error.message)
    }
  }

  return <form onSubmit={submit}>
    <h2>New lesson</h2>

    <label htmlFor="title">Title</label>
    <input
      id="title"
      type="text"
      value={title}
      placeholder=""
      onChange={e => setTitle(e.target.value)}
      required
    />

    <label htmlFor="slug">Slug</label>
    <input
      id="slug"
      type="text"
      value={slug}
      placeholder=""
      onChange={e => setSlug(e.target.value)}
      required
    />

    <br />

    <button
      type="submit"
      disabled={saving}
    >
      {saving ? 'Adding...' : 'Add lesson'}
    </button>
  </form>
}
