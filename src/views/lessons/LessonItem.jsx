import { useParams } from 'react-router-dom'
import { BreadcrumbItem, BreadcrumbSeparator, BreadcrumbWrapper } from '@/styles/Breadcrumbs'
import { Link } from 'react-router-dom'
import moment from 'moment'

import { supabase, useSupabaseQuery } from '@/db/supabase'
import LessonContent from './LessonContent'
import { TwoColumns } from '@/styles/Layout'
import { useUser } from "@/_state/user"

export default () => {
  const { slug, langId } = useParams()
  const { isAdmin } = useUser()

  const query = supabase
    .from('lessons')
    .select('*, current_edit(*)')
    .eq('slug', slug)
    .single()
  const [lesson, loading, error] = useSupabaseQuery(query, [slug])

  const lessonEdit = lesson?.current_edit

  return <>
    <BreadcrumbWrapper>
      <BreadcrumbItem to={`/${langId}/lessons`}>Lessons</BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem to={`/${langId}/lessons/${slug}`}>{lesson?.title_en}</BreadcrumbItem>
    </BreadcrumbWrapper>

    {error && error.message}
    {loading && 'loading...'}

    <h1>{lesson?.title_en}</h1>
    {lessonEdit?.topics?.join(', ')}
    <hr />

    <TwoColumns cols="2fr 1fr">
      <div>
        <LessonContent content={lessonEdit?.content_en || ''} />
      </div>
      <div>
        Created {moment(lesson?.created_at).format("MMMM Do, YYYY")}
        <br />
        Last edit {moment(lessonEdit?.created_at).format("MMMM Do, YYYY")}
        <br />
        <Link to={`/${langId}/lessons/${lesson?.slug}/history`}>History</Link>
        <br />
        { isAdmin && <Link to={`/${langId}/lessons/${lesson?.slug}/edit`}>Edit lesson</Link> }
      </div>
    </TwoColumns>
  </>
}
