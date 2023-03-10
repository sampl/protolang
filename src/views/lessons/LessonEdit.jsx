import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useNavigate, Link } from 'react-router-dom'
import styled from 'styled-components/macro'

import { BreadcrumbItem, BreadcrumbSeparator, BreadcrumbWrapper } from '@/styles/Breadcrumbs'
import { supabase, useSupabaseQuery } from '@/db/supabase'
import { useUser } from '@/_state/user'
import LessonContent from '@/views/lessons/LessonContent'
import { TwoColumns } from '@/styles/Layout'
import Modal from '@/styles/Modal'
import { CheckboxGroup } from '@/styles/RadioCheckbox'
import { logError } from '../../_util/error.js'
import EditorOnboarding from '../account/EditorOnboarding.jsx'
import LessonAdminEdit from './LessonAdminEdit'

export default () => {
  const { user, isAdmin } = useUser()
  const { langId, slug } = useParams()

  const [topics, setTopics] = useState([])
  const [content, setContent] = useState('')
  const [saving, setSaving] = useState(false)
  const navigate = useNavigate()

  const [helpModalOpen, setHelpModalOpen] = useState(false)
  const [topicsModalOpen, setTopicsModalOpen] = useState(false)

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
      setContent(!lesson.current_edit ? '' : lesson.current_edit.content_eng)
      setTopics( lesson.current_edit?.topics || [])
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
        content_eng: content,
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
      setSaving(false)
      logError('update lesson', error)
    }
  }

  if (lessonLoading || topicsLoading) {
    return 'Loading...'
  }

  if (!lesson || lessonError || topicsError) {
    return 'Error - could not load lesson ' + (topicsError?.message || lessonError?.message)
  }

  if (!user?.preferences?.hasAgreedToEditorTerms || !user.username) return <EditorOnboarding />

  return <>
    <BreadcrumbWrapper>
      <BreadcrumbItem to={`/${langId}/lessons`}>Lessons</BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem to={`/${langId}/lessons/${slug}`}>{lesson?.title_eng}</BreadcrumbItem>
      <BreadcrumbSeparator />
      Edit
    </BreadcrumbWrapper>

    <button style={{float: 'right'}} onClick={() => setHelpModalOpen(true)}>Formatting help</button>

    <h1>Edit lesson: {lesson.title_eng}</h1>
    {lesson?.title_ita && <p>{lesson.title_ita}</p> }

    <button type="button" onClick={() => setTopicsModalOpen(true)}>Edit topics ({topics?.length > 0 ? topics.join(', ') : 'none yet'})</button>

    <Modal
      title="Lesson formatting help"
      isOpen={helpModalOpen}
      onClose={() => setHelpModalOpen(false)}
    >
      <p>Lessons use <a target="_blank" href="https://talk.commonmark.org/t/generic-directives-plugins-syntax/444">markdown directives</a> to embed phrases.</p>
      <p>Here's an example:</p>
      <code>{`:word{ it="ciao }`}</code>
      <br />
      <a href="" target="_blank">Markdown docs</a>
    </Modal>

    <Modal
      title="Choose lesson topics"
      isOpen={topicsModalOpen}
      onClose={() => setTopicsModalOpen(false)}
    >
      <CheckboxGroup
        groupName="topics"
        values={topics}
        setValues={setTopics}
        options={!topicsList ? [] : topicsList.map(topic => ({id: topic.slug, description: topic.title_eng}))}
      />
    </Modal>

    { lesson && isAdmin && <p><LessonAdminEdit lesson={lesson} /></p> }

    <hr />
    <form onSubmit={submit}>
      <TwoColumns cols="1fr 1fr" gap="2">
        <EditTextarea
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

      <StickyLowNav>
        <button
          className="button"
          type="submit"
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save lesson'}
        </button>
      </StickyLowNav>

    </form>

  </>

}

const EditTextarea = styled.textarea`
  font-family: monospace;
  background: #eee;
`
const StickyLowNav = styled.div`
  z-index: 200;
  background: white;
  padding: 1rem 1px;
  border-top: 1px solid;
  margin: 2rem -1px 0;
  position: sticky;
  bottom: 0;
`
