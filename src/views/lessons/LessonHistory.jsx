import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'

import { BreadcrumbItem, BreadcrumbSeparator, BreadcrumbWrapper } from '@/styles/Breadcrumbs'
import { supabase, useSupabaseQuery } from '@/db/supabase'
import { useUser } from '@/_state/user'
import { TwoColumns } from '@/styles/Layout'

export default () => {
  const { user } = useUser()
  const { langId, lessonString } = useParams()

  const slug = lessonString.split('-').pop()

  const lessonQuery = supabase
    .from('lessons')
    .select()
    .eq('slug', slug)
    .single()
  const [lesson, lessonLoading, lessonError] = useSupabaseQuery(lessonQuery, [slug])

  const lessonEditsQuery = supabase
    .from('lesson_edits')
    .select('*, created_by(*)')
    .eq('lesson_id', lesson?.id)
  const [lessonEdits, lessonEditsLoading, lessonEditsError] = useSupabaseQuery(lessonEditsQuery, [slug, lesson?.id], !lesson)

  if (lessonLoading || lessonEditsLoading) {
    return 'Loading...'
  }

  if (!lesson || lessonError || lessonEditsError) {
    return 'Error - could not load lesson ' + (lessonEditsError?.message || lessonError?.message)
  }

  return <>
    <BreadcrumbWrapper>
      <BreadcrumbItem to={`/${langId}/lessons`}>Lessons</BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem to={`/${langId}/lessons/${slug}`}>{lesson?.title_eng}</BreadcrumbItem>
      <BreadcrumbSeparator />
      History
    </BreadcrumbWrapper>

    <h1>History: {lesson.title_eng}</h1>
    {lesson?.title_ita && <p>{lesson.title_ita}</p> }

    <hr />
    <TwoColumns cols="2fr 1fr">
      <div>
        {
          (!lessonEdits || lessonEdits.length) <= 0 ? `There's no content for this lesson yet` : 
          <table>
            {lessonEdits?.map(lessonEdit => {
              return <tr key={lessonEdit.id}>
                <td>
                  <Link to={`/${langId}/lessons/${slug}/history/${lessonEdit.id}`}>{lessonEdit.id}</Link>
                </td>
                <td>
                  { lessonEdit.created_by?.username ?
                    <Link to={`/u/${lessonEdit.created_by.username}`}>{lessonEdit.created_by.username}</Link> :
                    '❌ no username'
                  }
                </td>
                <td>
                  {new Intl.DateTimeFormat('en-US').format(new Date(lessonEdit.created_at)) || 'No timestamp'}
                </td>
              </tr>
            })}
          </table>
        }
      </div>
      {user &&
        <div>
          <Link to={`/${langId}/lessons/${slug}/edit`}>Edit lesson</Link>
        </div>
      }
    </TwoColumns>
  </>

}
