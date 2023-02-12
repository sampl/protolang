import { Link, useParams } from 'react-router-dom'

import { supabase, useSupabaseQuery } from '@/db/supabase'
import { useLanguage } from '@/_state/language'
import { TwoColumns } from '@/styles/Layout'
import LessonsDownload from './LessonsDownload'

export default () => {
  const { currentLanguage } = useLanguage()
  const { langId } = useParams()

  let query = supabase
    .from('lessons')
    .select()
    .eq('language', currentLanguage.id)
  const [lessons, loading, error] = useSupabaseQuery(query, [currentLanguage.id])

  return <>
    <h1>Lessons</h1>
    {
      error ? error.message :
      loading ? 'loading...' :
      <TwoColumns cols="5fr 2fr">
        <div>
          {(!lessons || lessons.length) <= 0 ? 'no lessons' : lessons?.map(lesson => <LessonListItem key={lesson.slug} lesson={lesson} />)}
        </div>
        <div>
          <p>{lessons?.length || 0} lesson{lessons?.length !== 1 && 's'}</p>
          <Link to={`/${langId}/lessons/new`}>+ Add lesson</Link>
          <LessonsDownload />
        </div>
      </TwoColumns>
    }
  </>
}

const LessonListItem = ({lesson}) => {
  const { langId } = useParams()
  return <div>
    <Link to={`/${langId}/lessons/${lesson.slug}`}>
      {lesson.title_en || 'Unknown'}
    </Link>
  </div>
}
