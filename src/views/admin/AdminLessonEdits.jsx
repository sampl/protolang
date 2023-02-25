import { Link, useParams } from 'react-router-dom'

import { supabase, useSupabaseQuery } from '@/db/supabase'

export default () => {
  const { langId } = useParams()

  const query = supabase
    .from('lesson_edits')
    .select('*, lesson_id(*)')
    .eq('language_id', langId)

  const [lessonEdits, loading, error] = useSupabaseQuery(query, [langId])

  if (error) return <div>error: {error.message}</div>
  if (loading) return <div>loading...</div>
  if (!lessonEdits || lessonEdits.length <= 0) return <div>no lesson edits</div>

  return <>
    <h1>Lesson Edits</h1>
    {lessonEdits.length} lesson edit{lessonEdits.length === 1 ? '' : 's'}

    <hr />

    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Lesson ID</th>
          <th>Lesson</th>
          <th>Author</th>
          <th>Timestamp</th>
          <th></th>
          <th></th>
          <th></th>
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
                {lessonEdit.lesson_id?.id}
              </td>
              <td>
                <Link to={`/${langId}/lessons/${lessonEdit.lesson_id?.slug}`}>{lessonEdit.lesson_id?.title_eng}</Link>
              </td>
              <td>
                {lessonEdit?.created_by?.slice(-6)}
              </td>
              <td>
                {new Intl.DateTimeFormat('en-US').format(new Date(lessonEdit.created_at))}
              </td>
              <td>
                <Link to={`/${langId}/lessons/${lessonEdit.lesson_id?.slug}/history/${lessonEdit.id}`}>View edit</Link>
              </td>
              <td>
                <Link to={`/${langId}/lessons/${lessonEdit.lesson_id?.slug}/edit`}>New edit</Link>
              </td>
              <td>
                <Link to={`/${langId}/lessons/${lessonEdit.lesson_id?.slug}/history`}>Full history</Link>
              </td>
            </tr>
          })
        }
      </tbody>
    </table>

  </>
}
