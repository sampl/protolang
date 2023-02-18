import { Link, useParams } from 'react-router-dom'
import styled from 'styled-components/macro'

import { supabase, useSupabaseQuery } from '@/db/supabase'
import { TwoColumns } from '@/styles/Layout'

export default () => {
  const { langId } = useParams()

  const query = supabase
    .from('lessons')
    .select()
    .eq('language_id', langId)
    .order('sort_order', { ascending: true })
  const [lessons, loading, error] = useSupabaseQuery(query, [langId])

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
  box-shadow: 2px 2px;
  padding: 1rem;
  background: white;
  text-decoration: none;
  &:hover {
    text-decoration: none;
  }
  &:active {
    position: relative;
    top: 1px;
    left: 1px;
    box-shadow: 1px 1px;
  }
`