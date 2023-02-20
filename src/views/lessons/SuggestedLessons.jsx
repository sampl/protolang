import { Link, useParams } from 'react-router-dom'
import styled from 'styled-components/macro'
import {groupBy} from 'lodash'

import { supabase, useSupabaseQuery } from '@/db/supabase'

export default () => {
  const { langId } = useParams()

  const query = supabase
    .from('lessons')
    .select()
    .eq('language_id', langId)
    // TODO - sort by order and remove completed lessons
  const [lessons, loading, error] = useSupabaseQuery(query, [langId])

  // TODO - get user's preferred topics
  const userTopics = ['animals', 'food']

  // TODO - filter this on the server
  const suggestedLessons = lessons?.filter(l => {
    return l.topics?.some(t => userTopics.includes(t))
  })

  if (error) return error.message
  if (loading) return 'loading...'
  if (suggestedLessons.length < 1) return '' // just don't show anything

  return <>
    <p>Suggested lesson{suggestedLessons.length !== 1 && 's'}</p>
    <SuggestedLessonsWrapper>
      {suggestedLessons.map(lesson => {
        return <SuggestedLessonWrapper key={lesson.slug} to={`/${langId}/lessons/${lesson.slug}`}>
          {lesson.title_en || 'Unknown lesson'}
        </SuggestedLessonWrapper>
      })}
    </SuggestedLessonsWrapper>
    <hr />
  </>
}

const SuggestedLessonsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 2rem 1rem;
  overflow-x: auto;
`
const SuggestedLessonWrapper = styled(Link)`
  border: 1px solid;
  padding: 1rem;
  text-decoration: none;
  min-height: 100px;
`
