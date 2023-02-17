import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useNavigate, Link } from 'react-router-dom'

import { BreadcrumbItem, BreadcrumbSeparator, BreadcrumbWrapper } from '@/styles/Breadcrumbs'
import { supabase, useSupabaseQuery } from '@/db/supabase'
import { useUser } from '@/_state/user'
import LessonContent from '@/views/lessons/LessonContent'
import { TwoColumns } from '@/styles/Layout'
import Modal from '@/styles/Modal'
import { CheckboxGroup } from '@/styles/RadioCheckbox'

export default () => {
  const { user } = useUser()
  const { langId, slug } = useParams()

  const [topics, setTopics] = useState([])
  const [content, setContent] = useState('')
  const [saving, setSaving] = useState(false)
  const navigate = useNavigate()

  const [helpIsOpen, setHelpIsOpen] = useState(false)

  const lessonQuery = supabase
    .from('lessons')
    .select('*, current_edit(*)')
    .eq('slug', slug)
    .single()
  const [lesson, lessonLoading, lessonError] = useSupabaseQuery(lessonQuery, [slug])

  const topicsQuery = supabase
    .from('topics')
    .select()
  const [topicsList, topicsLoading, topicsError] = useSupabaseQuery(topicsQuery, [slug])

  // all this crap should go away when we start using a backend
  useEffect(() => {
    if (lesson) {
      setContent(!lesson.current_edit ? '' : lesson.current_edit.content_en)
      setTopics( !lesson.current_edit ? [] : lesson.current_edit.topics)
    }
  }, [lesson])

  const submit = async event => {
    event.preventDefault()
    try {
      setSaving(true)

      // create a lesson_edit
      const lessonEditUpdates = {
        language_id: langId,
        lesson_id: lesson.id,
        content_en: content,
        topics,
        created_by: user.id,
      }
      const { data: lessonEdit, error: lessonEditError } = await supabase
        .from('lesson_edits')
        .insert([lessonEditUpdates])
        .select()
      if (lessonEditError) {
        throw lessonEditError
      }

      // update lesson
      const lessonUpdates = {
        current_edit: lessonEdit[0].id,
      }
      const { data: newLesson, error: lessonError } = await supabase
        .from('lessons')
        .update(lessonUpdates)
        .eq('id', lesson.id)
        .select()
      if (lessonError) {
        throw lessonError
      }

      // alert('Saved!')
      navigate(`/${langId}/lessons/${slug}`)
    } catch (error) {
      alert(error.message)
      setSaving(false)
    }
  }

  if (lessonLoading || topicsLoading) {
    return 'Loading...'
  }

  if (!lesson || lessonError || topicsError) {
    return 'Error - could not load lesson ' + (topicsError?.message || lessonError?.message)
  }

  return <>
    <BreadcrumbWrapper>
      <BreadcrumbItem to={`/${langId}/lessons`}>Lessons</BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem to={`/${langId}/lessons/${slug}`}>{lesson?.title_en}</BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem to={`/${langId}/lessons/${slug}/edit`}>Edit</BreadcrumbItem>
    </BreadcrumbWrapper>

    <h2>Edit lesson: {lesson.title_en}</h2>
    <Link to={`/${langId}/lessons/${lesson?.slug}`}>View live</Link>

    <button style={{float: 'right'}} onClick={() => setHelpIsOpen(true)}>Formatting help</button>

    <Modal isOpen={helpIsOpen} onClose={() => setHelpIsOpen(false)}>
      <p>Lessons use <a target="_blank" href="https://talk.commonmark.org/t/generic-directives-plugins-syntax/444">markdown directives</a> to embed phrases.</p>
      <p>Here's an example:</p>
      <code>{`:word{ it="ciao }`}</code>
      <br />
      <a href="" target="_blank">Markdown docs</a>
    </Modal>

    <hr />
    <form onSubmit={submit}>
      <TwoColumns cols="1fr 1fr">
        <textarea
          id="content"
          type="text"
          value={content}
          placeholder=""
          onChange={e => setContent(e.target.value)}
          required
          style={{
            width: '100%',
            height: '100%',
            minHeight: '400px',
          }}
        />
        <div>
          <LessonContent content={content} />
        </div>
      </TwoColumns>
      <CheckboxGroup
        groupName="topics"
        values={topics}
        setValues={setTopics}
        options={!topicsList ? [] : topicsList.map(topic => ({id: topic.id, description: topic.title_en}))}
      />
      <button
        type="submit"
        disabled={saving}
      >
        {saving ? 'Saving...' : 'Save lesson'}
      </button>
  </form>

  </>

}
