import { Link, useParams } from 'react-router-dom'
import styled from 'styled-components/macro'

import { supabase, useSupabaseQuery } from '@/db/supabase'
import { TwoColumns } from '@/styles/Layout'
import LessonsDownload from './LessonsDownload'

export default () => {
  const { langId } = useParams()

  let query = supabase
    .from('lessons')
    .select()
    .eq('language', langId)
  const [lessons, loading, error] = useSupabaseQuery(query, [langId])

  return <>
    <h1>Lessons</h1>
    {
      error ? error.message :
      loading ? 'loading...' :
      <TwoColumns cols="5fr 2fr">
        <LessonListWrapper>
          {
            (!lessons || lessons.length) <= 0 ? 'no lessons' : 
            lessons?.map(lesson => {
              return <LessonListItemWrapper key={lesson.slug} to={`/${langId}/lessons/${lesson.slug}`}>
                {lesson.title_en || 'Unknown'}
              </LessonListItemWrapper>
            })}
        </LessonListWrapper>
        <div>
          <p>{lessons?.length || 0} lesson{lessons?.length !== 1 && 's'}</p>
          <Link to={`/${langId}/lessons/new`}>+ Add lesson</Link>
          <LessonsDownload />
        </div>
      </TwoColumns>
    }
  </>
}

const LessonListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  /* gap: 2rem 1rem; */
  /* grid-template-columns: 1fr 1fr; */
`
const LessonListItemWrapper = styled(Link)`
  /* border: 1px solid; */
  /* padding: 1rem; */
  /* text-decoration: none; */
  /* min-height: 100px; */
`
