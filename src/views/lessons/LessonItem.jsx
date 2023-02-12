import { useParams } from 'react-router-dom'
import { BreadcrumbItem, BreadcrumbSeparator, BreadcrumbWrapper } from '@/styles/Breadcrumbs'
import { Link } from 'react-router-dom'

import { supabase, useSupabaseQuery } from '@/db/supabase'
import LessonContent from './LessonContent'
import { TwoColumns } from '@/styles/Layout'

export default () => {
  const { slug, langId } = useParams()

  let query = supabase
    .from('lessons')
    .select()
    .eq('slug', slug)
    .single()
  const [lesson, loading, error] = useSupabaseQuery(query, [slug])

  return <>
    <BreadcrumbWrapper>
      <BreadcrumbItem to={`/${langId}/lessons`}>Lessons</BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem to={`/${langId}/lessons/${slug}`}>{lesson?.title_en}</BreadcrumbItem>
    </BreadcrumbWrapper>

    {error && error.message}
    {loading && 'loading...'}

    <h1>{lesson?.title_en}</h1>
    <hr />

    <TwoColumns>
      <div>
        <LessonContent content={lesson?.content_en || ''} />
      </div>
      <div>
        <Link to={`/${langId}/lessons/${lesson?.slug}/edit`}>Edit lesson</Link>
        <br />
        Created {lesson?.created_at}
        <br />
        Last edit {lesson?.updated_at}
      </div>
    </TwoColumns>
  </>
}
