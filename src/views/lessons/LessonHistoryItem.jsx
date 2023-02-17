import { useParams } from 'react-router-dom'
import { BreadcrumbItem, BreadcrumbSeparator, BreadcrumbWrapper } from '@/styles/Breadcrumbs'
// import { Link } from 'react-router-dom'
import moment from 'moment'

import { supabase, useSupabaseQuery } from '@/db/supabase'
import LessonContent from './LessonContent'
import { TwoColumns } from '@/styles/Layout'
// import { useUser } from "@/_state/user"

export default () => {
  const { slug, langId, editId } = useParams()
  // const { isAdmin } = useUser()

  const lessonQuery = supabase
    .from('lessons')
    .select()
    .eq('slug', slug)
    .single()
  const [lesson, lessonLoading, lessonError] = useSupabaseQuery(lessonQuery, [slug])

  const lessonEditQuery = supabase
    .from('lesson_edits')
    .select()
    .eq('id', editId)
    .single()
  const [lessonEdit, lessonEditLoading, lessonEditError] = useSupabaseQuery(lessonEditQuery)

  return <>
    <BreadcrumbWrapper>
      <BreadcrumbItem to={`/${langId}/lessons`}>Lessons</BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem to={`/${langId}/lessons/${slug}`}>{lesson?.title_en}</BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem to={`/${langId}/lessons/${slug}/history`}>History</BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem to={`/${langId}/lessons/${slug}/history/${lessonEdit?.id}`}>{lessonEdit?.id}</BreadcrumbItem>
    </BreadcrumbWrapper>

    {lessonError && lessonError.message}
    {lessonEditError && lessonEditError.message}
    {(lessonEditLoading || lessonLoading) && 'loading...'}

    <h1>{lesson?.title_en}: {lessonEdit?.id}</h1>
    <hr />

    <TwoColumns cols="2fr 1fr">
      <div>
        <LessonContent content={lessonEdit?.content_en || ''} />
      </div>
      <div>
        Created {moment(lessonEdit?.created_at).format("MMMM Do, YYYY")}
        <br />
        by {lessonEdit?.created_by}
      </div>
    </TwoColumns>
  </>
}
