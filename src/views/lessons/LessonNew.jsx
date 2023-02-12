import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { useUser } from '@/_state/user'
import { supabase } from '@/db/supabase'

export default () => {
  const { user } = useUser()
  const { lang: urlLang } = useParams()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [saving, setSaving] = useState(false)

  async function submit( event ) {
    event.preventDefault()
    debugger
    try {
      setSaving(true)

      const newData = {
        language: urlLang,
        title_en: name,
        slug,
        is_public: false,
        created_by: user.id,
      }

      let { error } = await supabase.from('lessons').insert([newData])

      if (error) {
        throw error
      }
      console.log('saved')
      navigate(`/${urlLang}/lessons/${slug}/edit`)
    } catch (error) {
      alert(error.message)
    } finally {
      setSaving(false)
      setName('')
      setSlug('')
    }
  }

  return <form onSubmit={submit}>
    <h2>New lesson</h2>

    <label htmlFor="name">Name</label>
    <input
      id="name"
      type="text"
      value={name}
      placeholder=""
      onChange={e => setName(e.target.value)}
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


