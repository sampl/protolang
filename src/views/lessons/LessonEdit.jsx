import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelect, useFilter } from 'react-supabase'
import { useNavigate, Link } from 'react-router-dom'

import { useUser } from '@/_state/user'
import { supabase } from '@/_util/supabaseClient'
import LessonContent from './LessonContent'
import { TwoColumns } from '@/styles/Layout'

export default () => {
  const { user } = useUser()
  const { lang: urlLang, slug } = useParams()

  const [{ data, lessonGetError, lessonGetFetching }] = useSelect('lessons', {
    filter: useFilter(
      (query) => query.eq('slug', slug),
      [slug],
    ),
  })

  const lesson = data && data[0]

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

  if (!lesson) {
    return 'loading...'
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
