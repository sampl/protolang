import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'

import { BreadcrumbItem, BreadcrumbSeparator, BreadcrumbWrapper } from '@/styles/Breadcrumbs'
import { supabase, useSupabaseQuery } from '@/db/supabase'
import { useUser } from '@/_state/user'
import { TwoColumns } from '@/styles/Layout'

export default () => {
  const { user } = useUser()
  const { langId, slug } = useParams()

  const lessonQuery = supabase
    .from('lessons')
    .select()
    .eq('slug', slug)
    .single()
  const [lesson, lessonLoading, lessonError] = useSupabaseQuery(lessonQuery, [slug])

  const lessonEditsQuery = supabase
    .from('lesson_edits')
    .select()
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
    <hr />
    <TwoColumns cols="2fr 1fr">
      <div>
        {
          (!lessonEdits || lessonEdits.length) <= 0 ? `There's no content for this lesson yet` : 
          lessonEdits?.map(lessonEdit => {
            return <div key={lessonEdit.id}>
              <Link to={`/${langId}/lessons/${slug}/history/${lessonEdit.id}`}>
                {lessonEdit.id || 'Unknown'} - {lessonEdit.created_by || 'No author'}
                {' - '}
                {new Intl.DateTimeFormat('en-US').format(new Date(lessonEdit.created_at)) || 'No timestamp'}
              </Link>
            </div>
          })
        }
      </div>
      {user?.isAdmin &&
        <div>
          <Link to={`/${langId}/lessons/${slug}/edit`}>Edit lesson</Link>
        </div>
      }
    </TwoColumns>
  </>

}
