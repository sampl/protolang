import { useSelect, useFilter } from 'react-supabase'
import { Link, useParams } from 'react-router-dom'

import { useLanguage } from '@/_state/language'
import { BreadcrumbItem, BreadcrumbWrapper } from '@/styles/Breadcrumbs'

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
      lessons.map(lesson => <LessonListItem key={lesson.id} lesson={lesson} />)
    }
  </>
}

const LessonListItem = ({lesson}) => {
  const { currentLanguage } = useLanguage()
  return <div>
    <Link to={`/${urlLang}/lessons/${lesson.id}`}>
      {lesson.title_en || 'Unknown'}
    </Link>
  </div>
}
