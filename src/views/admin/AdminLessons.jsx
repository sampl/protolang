import { Link, useParams } from 'react-router-dom'

import { supabase, useSupabaseQuery } from '@/db/supabase'
import { logError } from '../../_util/error.js'
import LessonAdminEdit from '../lessons/LessonAdminEdit.jsx'

export default () => {
  const { langId } = useParams()

  const query = supabase
    .from('lessons')
    .select('*, current_edit(*)')
    .eq('language_id', langId)
    .order('sort_order',  { ascending: true })

  const [lessons, loading, error] = useSupabaseQuery(query, [langId])

  const sortLesson = async (lessonId, direction) => {

    try {
      const currentLessonIndex = lessons.findIndex(l => l.id === lessonId)
      const currentLesson = lessons.find(l => l.id === lessonId)
      const lessonBefore = currentLessonIndex > 0 && lessons[currentLessonIndex - 1]
      const lessonAfter = currentLessonIndex < lessons.length - 1 && lessons[currentLessonIndex + 1]

      const { error: lessonError } = await supabase
        .from('lessons')
        .update({ sort_order: currentLesson.sort_order + direction })
        .eq('id', lessonId)
      if (lessonError) throw new Error(`Could not update lesson ${lessonId} - ${lessonError.message}`)

      const lessonToChange = direction === -1 ? lessonBefore : lessonAfter
      if (!lessonToChange) return

      const { error: lessonToChangeError } = await supabase
        .from('lessons')
        .update({ sort_order: currentLesson.sort_order + (-1 * direction) })
        .eq('id', lessonToChange.id)
      if (lessonToChangeError) throw new Error(`Could not update lesson ${lesson.id} - ${lessonError.message}`)

      location.reload()

    } catch (error) {
      logError('sort lesson', error)
    }
  }

  const changeLessonUnit = async (lessonId, direction) => {
    try {
      const currentLessonIndex = lessons.findIndex(l => l.id === lessonId)
      const currentLesson = lessons.find(l => l.id === lessonId)

      const { error: lessonError } = await supabase
        .from('lessons')
        .update({ unit: currentLesson.unit + direction })
        .eq('id', lessonId)
      if (lessonError) throw new Error(`Could not update lesson ${lessonId} - ${lessonError.message}`)

      location.reload()

    } catch (error) {
      logError('change lesson unit', error)
    }
  }

  if (error) return <div>error: {error.message}</div>
  if (loading) return <div>loading...</div>
  if (!lessons || lessons.length <= 0) return <div>no lessons</div>

  return <>
    <h1>Lessons</h1>
    {lessons.length} lesson{lessons.length === 1 ? '' : 's'}

    <hr />

    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Title</th>
          <th>Title Ita (coming soon)</th>
          <th>Slug</th>
          <th>Unit</th>
          <th>Sort order</th>
          <th>Topics</th>
          <th>Phrase count</th>
          <th>Chars</th>
          <th>Created by</th>
          <th>Created at</th>
          <th></th>
          <th></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {
          lessons.map(lesson => {
            return <tr key={lesson.id}>
              <td>
                {lesson.id}
              </td>
              <td>
                <Link to={`/${langId}/lessons/${lesson.slug}`}>{lesson.title_eng}</Link>
              </td>
              <td>
                {lesson.title_ita}
              </td>
              <td>
                {lesson.slug}
              </td>
              <td>
                <span style={{display: 'flex'}}>
                  <span>{lesson.unit}</span>
                  <button onClick={() => changeLessonUnit(lesson.id,  1)}>+</button>
                  <button onClick={() => changeLessonUnit(lesson.id, -1)}>-</button>
                </span>
              </td>
              <td>
                <span style={{display: 'flex'}}>
                  <span>{lesson.sort_order}</span>
                  <button onClick={() => sortLesson(lesson.id, -1)}>???</button>
                  <button onClick={() => sortLesson(lesson.id,  1)}>???</button>
                </span>
              </td>
              <td>
                {lesson.current_edit?.topics?.join(', ') || '-'}
              </td>
              <td>
                {lesson.current_edit?.phrase_strings_ita?.length || 0}
              </td>
              <td>
                {lesson.current_edit?.content_eng?.length || 0}
              </td>
              <td>
                {lesson.created_by.slice(-6)}
              </td>
              <td>
                {new Intl.DateTimeFormat('en-US').format(new Date(lesson.created_at))}
              </td>
              <td>
                <Link to={`/${langId}/lessons/${lesson.slug}/edit`}>Edit</Link>
              </td>
              <td>
                <LessonAdminEdit lesson={lesson} />
              </td>
              <td>
                <Link to={`/${langId}/lessons/${lesson.slug}/history`}>History</Link>
              </td>
            </tr>
          })
        }
      </tbody>
    </table>

  </>
}
