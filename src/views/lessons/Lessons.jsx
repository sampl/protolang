import { useSelect, useFilter } from 'react-supabase'
import { Link, useParams } from 'react-router-dom'

import { useLanguage } from '@/_state/language'
import { BreadcrumbItem, BreadcrumbWrapper } from '@/styles/Breadcrumbs'
import { TwoColumns } from '@/styles/Layout'

export default () => {
  const { currentLanguage } = useLanguage()
  const { lang: urlLang } = useParams()

  const [{ data: lessons, error, fetching }] = useSelect('lessons', {
    filter: useFilter(
      (query) => query.eq('language', currentLanguage.id),
      [currentLanguage.id],
    ),
  })

  return <>
    <BreadcrumbWrapper>
      <BreadcrumbItem to={`/${urlLang}/lessons`}>Lessons</BreadcrumbItem>
    </BreadcrumbWrapper>

    <h1>Lessons</h1>
    {
      error ? error.message :
      fetching ? 'loading...' :
      (!lessons || lessons.length <= 0) ? 'no lessons' :
      <TwoColumns cols="auto max-content">
        <div>
          {lessons.map(lesson => <LessonListItem key={lesson.slug} lesson={lesson} />)}
        </div>
        <div>
          {lessons.length} lesson{lessons.length !== 1 && 's'}
        </div>
      </TwoColumns>
    }
  </>
}

const LessonListItem = ({lesson}) => {
  const { lang: urlLang } = useParams()
  return <div>
    <Link to={`/${urlLang}/lessons/${lesson.slug}`}>
      {lesson.title_en || 'Unknown'}
    </Link>
  </div>
}
