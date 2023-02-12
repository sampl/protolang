import { Link, useParams } from 'react-router-dom'
import styled from 'styled-components/macro'

import { supabase, useSupabaseQuery } from '@/db/supabase'
import { useLanguage } from '@/_state/language'
import { TwoColumns } from '@/styles/Layout'
import Card from '@/styles/Card'

export default () => {
  const { langId } = useParams()
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
      <TwoColumns gap="1">
        <QuickLinkItemWrapper to={nextLesson ? `/${langId}/lessons/${nextLesson.slug}` : '/'}>
          Lesson: {nextLesson?.title_en || 'No lesson'} →
        </QuickLinkItemWrapper>
        <QuickLinkItemWrapper to={`/${langId}/practice`}>
          Practice →
        </QuickLinkItemWrapper>
      </TwoColumns>
    }
  </div>
}

const QuickLinkItemWrapper = styled(Link)`
  border: 1px solid;
  padding: 1rem;
  background: white;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`