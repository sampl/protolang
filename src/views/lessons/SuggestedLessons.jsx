import { Link, useParams } from 'react-router-dom'
import styled from 'styled-components/macro'

import { supabase, useSupabaseQuery } from '@/db/supabase'
import { useLanguage } from '@/_state/language'

export default () => {
  const { langId } = useParams()
  const { currentUserLanguage } = useLanguage()

  // TODO - remove completed lessons
  const query = supabase
    .from('lessons')
    .select('*, current_edit(*)')
    .eq('language_id', langId)
    .order('sort_order',  { ascending: true })
  const [lessons, loading, error] = useSupabaseQuery(query, [langId])

  const userTopics = currentUserLanguage?.preferences?.topics || []

  const suggestedLessons = lessons?.filter(l => {
    return l.current_edit?.topics?.some(t => userTopics.includes(t))
  })

  if (error) return error.message
  if (loading) return 'loading...'
  if (suggestedLessons.length < 1) return '' // just don't show anything

  return <>
    <h2>Based on your interests</h2>
    <SuggestedLessonsWrapper>
      {suggestedLessons.map(lesson => {
        return <SuggestedLessonWrapper key={lesson.slug} to={`/${langId}/lessons/${lesson.slug}`}>
          {lesson.title_eng || 'Unknown lesson'}
        </SuggestedLessonWrapper>
      })}
    </SuggestedLessonsWrapper>
    <br />
  </>
}

const SuggestedLessonsWrapper = styled.div`
  /* display: flex;
  flex-direction: row;
  gap: 1rem 0.5rem;
  flex-wrap: wrap; */
`
const SuggestedLessonWrapper = styled(Link)`
  /* border: 1px solid;
  padding: 1rem;
  text-decoration: none;
  min-height: 60px;
  min-width: 200px; */
`
