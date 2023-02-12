import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useNavigate, Link } from 'react-router-dom'

import { supabase, useSupabaseQuery } from '@/db/supabase'
import { useUser } from '@/_state/user'
import LessonContent from './LessonContent'
import { TwoColumns } from '@/styles/Layout'

export default () => {
  const { user } = useUser()
  const { lang: urlLang, slug } = useParams()

  let query = supabase
    .from('lessons')
    .select()
    .eq('slug', slug)
    .single()
  const [lesson, loading, error] = useSupabaseQuery(query, [slug])

  useEffect(() => {
    setName(lesson?.title_en || '')
    setContent(lesson?.content_en || '')
  }, [lesson])

  const [content, setContent] = useState('')
  const [saving, setSaving] = useState(false)
  const [name, setName] = useState('')
  const navigate = useNavigate()

  async function submit( event ) {
    event.preventDefault()
    try {
      setSaving(true)

      const updates = {
        id: lesson.id,
        title_en: name,
        content_en: content,
        slug,
        created_by: user.id,
      }

      let { error } = await supabase
        .from('lessons')
        .update(updates)
        .eq('id', lesson.id)

      if (error) {
        throw error
      }
      alert('Saved!')
      navigate(`/${urlLang}/lessons/${slug}`)
    } catch (error) {
      alert(error.message)
    } finally {
      setSaving(false)
    }
  }

  const exampleString = `:word{ it="ciao }`

  if (loading) {
    return 'Loading...'
  }

  if (!lesson) {
    return 'Error - no lesson found' + error?.message
  }

  return <>
    <h2>Edit lesson</h2>
    <Link to={`/${urlLang}/lessons/${lesson?.slug}`}>View live</Link>
    <hr />
    <TwoColumns>
      <form onSubmit={submit}>
        <input
          id="name"
          type="text"
          value={name}
          placeholder="Lesson name"
          onChange={e => setName(e.target.value)}
          required
        />
        <textarea
          id="content"
          type="text"
          value={content}
          placeholder=""
          onChange={e => setContent(e.target.value)}
          required
          style={{
            width: '800px',
            maxWidth: '100%',
            height: '100%',
          }}
        />
        <button
          type="submit"
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save lesson'}
        </button>
      </form>
      <div>
        <LessonContent content={content} />
      </div>
    </TwoColumns>

    <div>
      <p>
        Lessons use <a target="_blank" href="https://talk.commonmark.org/t/generic-directives-plugins-syntax/444">markdown directives</a> to embed audio.
      </p>

      <p>
        Here's an example:
      </p>

      <code>{exampleString}</code>

    </div>
  </>

}
