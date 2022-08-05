import { useSelect, useFilter } from 'react-supabase'
import { Link } from 'react-router-dom'

import { useLanguage } from '@/_state/language'

export default () => {
  
  const { currentLanguageId } = useLanguage()
  
  const filter = useFilter(
    (query) => query
      .eq('language', currentLanguageId)
      .order('order', { ascending: true }),
    [currentLanguageId],
  )

  const [{ data: lessons, error, fetching }] = useSelect('lessons', {
    filter,
  })

  // TODO - suggest lessons that aren't super complete
  // const isIncomplete = l => !l.user_lessons || l.user_lessons.length === 0 || !l.user_lessons[0].completed
  // const incompleteLessons = lessons?.filter(isIncomplete)
  // const nextLesson = incompleteLessons && incompleteLessons[0]
  const nextLesson = lessons && lessons[0]

  return <div>
    {
      error ? error.message :
      fetching ? 'loading...' :
      <>
        { nextLesson && <Link to={`/lessons/${nextLesson.id}`}>Lesson: {nextLesson.title_en} →</Link> }
        <br />
        <Link to="/practice">Practice →</Link>
      </>
    }
  </div>
}
