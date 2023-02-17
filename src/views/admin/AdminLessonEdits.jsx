import { Link, useParams } from 'react-router-dom'

import { supabase, useSupabaseQuery } from '@/db/supabase'

export default () => {
  const { langId } = useParams()

  const query = supabase
    .from('lesson_edits')
    .select()
    .eq('language_id', langId)

  const [lessonEdits, loading, error] = useSupabaseQuery(query, [langId])

  if (error) return <div>error: {error.message}</div>
  if (loading) return <div>loading...</div>
  if (!lessonEdits || lessonEdits.length <= 0) return <div>no lesson edits</div>

  // TODO - link to the edit! need lesson slug for URL though

  return <>
    <h1>Lesson Edits</h1>
    {lessonEdits.length} lesson edits{lessonEdits.length === 1 ? '' : 's'}

    <hr />

    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Lesson</th>
          <th>Author</th>
          <th>Timestamp</th>
        </tr>
      </thead>
      <tbody>
        {
          lessonEdits.map(lessonEdit => {
            return <tr key={lessonEdit.id}>
              <td>
                {lessonEdit.id}
              </td>
              <td>
                Lesson id {lessonEdit.lesson_id}
              </td>
              <td>
                {lessonEdit.created_by}
              </td>
              <td>
                {new Intl.DateTimeFormat('en-US').format(new Date(lessonEdit.created_at))}
              </td>
            </tr>
          })
        }
      </tbody>
    </table>

  </>
}
