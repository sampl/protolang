import { useParams } from 'react-router-dom'
import { useFilter, useSelect } from 'react-supabase'
import { BreadcrumbItem, BreadcrumbSeparator, BreadcrumbWrapper } from '@/styles/Breadcrumbs'
import { Link } from 'react-router-dom'
import LessonContent from './LessonContent'
import { TwoColumns } from '@/styles/Layout'

export default () => {
  const { slug, lang: urlLang } = useParams()

  const [{ data, error, fetching }] = useSelect('lessons', {
    filter: useFilter(
      (query) => query.eq('slug', slug),
      [slug],
    ),
  })

  const lesson = data && data[0]

  return <>
    <BreadcrumbWrapper>
      <BreadcrumbItem to={`/${urlLang}/lessons`}>Lessons</BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem to={`/${urlLang}/lessons/${slug}`}>{lesson?.title_en}</BreadcrumbItem>
    </BreadcrumbWrapper>

    {error && error.message}
    {fetching && 'loading...'}

    <h1>{lesson?.title_en}</h1>
    <hr />

    <TwoColumns>
      <div>
        <LessonContent content={lesson?.content_en || ''} />
      </div>
      <div>
        <Link to={`/${urlLang}/lessons/${lesson?.slug}/edit`}>Edit lesson</Link>
        <br />
        Created {lesson?.created_at}
        <br />
        Last edit {lesson?.updated_at}
      </div>
    </TwoColumns>
  </>
}
