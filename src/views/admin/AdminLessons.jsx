import { Link, useParams } from 'react-router-dom'

import { supabase, useSupabaseQuery } from '@/db/supabase'

export default () => {
  const { langId } = useParams()

  const query = supabase
    .from('lessons')
    .select()
    .eq('language_id', langId)

  const [lessons, loading, error] = useSupabaseQuery(query, [langId])

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
          <th>Slug</th>
          <th>Sort order</th>
          <th>Created by</th>
          <th>Created at</th>
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
                <Link to={`/${langId}/lessons/${lesson.slug}`}>{lesson.title_en}</Link>
              </td>
              <td>
                {lesson.slug}
              </td>
              <td>
                {lesson.sort_order}
              </td>
              <td>
                {lesson.created_by}
              </td>
              <td>
                {new Intl.DateTimeFormat('en-US').format(new Date(lesson.created_at))}
              </td>
              <td>
                <Link to={`/${langId}/lessons/${lesson.slug}/edit`}>Edit</Link>
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
