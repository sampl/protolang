import { useParams } from 'react-router-dom'
import { BreadcrumbItem, BreadcrumbSeparator, BreadcrumbWrapper } from '@/styles/Breadcrumbs'
import moment from 'moment'

import { supabase, useSupabaseQuery } from '@/db/supabase'
import LessonContent from './LessonContent'
import { TwoColumns } from '@/styles/Layout'

export default () => {
  const { slug, langId, editId } = useParams()

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
      <BreadcrumbItem to={`/${langId}/lessons/${slug}`}>{lesson?.title_eng}</BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem to={`/${langId}/lessons/${slug}/history`}>History</BreadcrumbItem>
      <BreadcrumbSeparator />
      {lessonEdit?.id}
    </BreadcrumbWrapper>

    {lessonError && lessonError.message}
    {lessonEditError && lessonEditError.message}
    {(lessonEditLoading || lessonLoading) && 'loading...'}

    <h1>{lesson?.title_eng}: {lessonEdit?.id}</h1>
    <hr />

    <TwoColumns cols="2fr 1fr">
      <div>
        <LessonContent content={lessonEdit?.content_eng || ''} />
      </div>
      <div>
        Created {moment(lessonEdit?.created_at).format("MMMM Do, YYYY")}
        <br />
        by {lessonEdit?.created_by}
      </div>
    </TwoColumns>
  </>
}
