import { useSelect, useFilter } from 'react-supabase'
import { Link } from 'react-router-dom'

import { useLanguage } from '@/_state/language'
import Layout from '@/_layout/Layout'

export default () => {

  const { currentLanguageId } = useLanguage()

  const filter = useFilter(
    (query) => query.eq('language', currentLanguageId),
    [currentLanguageId],
  )

  const [{ data: lessons, error, fetching }] = useSelect('lessons', { filter })

  return <Layout>
    <h1>Lessons</h1>
    {
      error ? error.message :
      fetching ? 'loading...' :
      (!lessons || lessons.length <= 0) ? 'no lessons' :
      lessons.map(lesson => <LessonListItem key={lesson.id} lesson={lesson} />)
    }
  </Layout>
}

const LessonListItem = ({lesson}) => {
  return <div>
    <Link to={`/lessons/${lesson.id}`}>
      {lesson.title_en || 'Unknown'}
    </Link>
  </div>
}
