import { Link, useParams } from 'react-router-dom'

import { supabase, useSupabaseQuery } from '@/db/supabase'
import { useLanguage } from '@/_state/language'
import { TwoColumns } from '@/styles/Layout'
import Card from '@/styles/Card'

export default () => {
  const { lang: urlLang } = useParams()
  const { currentLanguage } = useLanguage()

  let query = supabase
    .from('lessons')
    .select()
    .eq('language', currentLanguage.id)
    .order('sort_order', { ascending: true })
  const [lessons, loading, error] = useSupabaseQuery(query, [currentLanguage.id])

  // TODO - suggest lessons that aren't super complete
  // const isIncomplete = l => !l.user_lessons || l.user_lessons.length === 0 || !l.user_lessons[0].completed
  // const incompleteLessons = lessons?.filter(isIncomplete)
  // const nextLesson = incompleteLessons && incompleteLessons[0]
  const nextLesson = lessons && lessons[0]

  return <div>
    {
      error ? error.message :
      loading ? 'loading...' :
      <TwoColumns>
        <Card>
          { nextLesson && <Link to={`/${urlLang}/lessons/${nextLesson.slug}`}>Lesson: {nextLesson.title_en} →</Link> }
        </Card>
        <Card>
          <Link to={`/${urlLang}/practice`}>Practice →</Link>
        </Card>
      </TwoColumns>
    }
  </div>
}
