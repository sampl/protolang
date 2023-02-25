import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import slugify from 'slugify'

import { useUser } from '@/_state/user'
import { supabase, useSupabaseQuery } from '@/db/supabase'
import { logError } from '../../_util/error.js'

export default () => {
  const { user } = useUser()
  const { langId } = useParams()
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [unit, setUnit] = useState(1)
  const [saving, setSaving] = useState(false)

  const lessonCountQuery = supabase
    .from('lessons')
    .select('*', { count: 'exact', head: true })
  const [lessonCount, lessonCountLoading, lessonCountError] = useSupabaseQuery(lessonCountQuery)

  const count = lessonCount?.count || 0
  const slug = slugify(title, { lower: true })

  async function submit( event ) {
    event.preventDefault()
    try {
      setSaving(true)

      const newData = {
        language_id: langId,
        title_eng: title,
        slug,
        unit,
        sort_order: count,
        created_by: user.id,
      }

      const { data: newLesson, error } = await supabase
        .from('lessons')
        .insert([newData])
        .select()

      if (error) {
        throw error
      }
      navigate(`/${langId}/lessons/${newLesson[0].slug}/edit`)
    } catch (error) {
      setSaving(false)
      logError('create lesson', error)
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
      required
      disabled
    />

    <label htmlFor="count">Sort order</label>
    <input
      id="count"
      type="number"
      value={count}
      disabled
    />

    <label htmlFor="unit">Unit</label>
    <input
      id="unit"
      type="number"
      value={unit}
      placeholder="Unit"
      onChange={e => setUnit(e.target.value)}
      required
    />

    <br />

    <button
      type="submit"
      disabled={saving || lessonCountLoading || lessonCountError}
    >
      {saving ? 'Adding...' : 'Add lesson'}
    </button>
  </form>
}
