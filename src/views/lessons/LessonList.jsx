import { Link, useParams } from 'react-router-dom'
import styled from 'styled-components/macro'
// import {groupBy} from 'lodash'

import { supabase, useSupabaseQuery } from '@/db/supabase'
import { TwoColumns } from '@/styles/Layout'
import SuggestedLessons from './SuggestedLessons'
import QuickLinks from "./QuickLinks"
import { useUser } from '@/_state/user'

export default () => {
  const { langId } = useParams()
  const { user } = useUser()

  const query = supabase
    .from('lessons')
    .select()
    .eq('language_id', langId)
    .order('sort_order',  { ascending: true })
  const [lessons, loading, error] = useSupabaseQuery(query, [langId])

  return <>
    <QuickLinks />
    <br />
    {
      error ? error.message :
      loading ? 'loading...' :
      <TwoColumns cols="5fr 2fr">
        <LessonListWrapper>
          {(!lessons || lessons.length) <= 0 && 'no lessons'}
          <LessonUnitWrapper>
            <h2>Start here</h2>
            {lessons.filter(l => l.unit === 0).map(lesson => {
              return <LessonListItemWrapperBig key={lesson.slug} to={`/${langId}/lessons/${lesson.slug}`}>
                {lesson.title_eng || 'Unknown'}
              </LessonListItemWrapperBig>
            })}
          </LessonUnitWrapper>
          <LessonUnitWrapper>
            <SuggestedLessons />
          </LessonUnitWrapper>
          <LessonUnitWrapper>
            <h2>Beginner</h2>
            <div style={{columns: 2}}>
              {lessons.filter(l => l.unit === 1).map(lesson => {
                return <LessonListItemWrapper key={lesson.slug} to={`/${langId}/lessons/${lesson.slug}`}>
                  {lesson.title_eng || 'Unknown'}
                </LessonListItemWrapper>
              })}
            </div>
          </LessonUnitWrapper>
          <LessonUnitWrapper>
            <h2>Intermediate</h2>
            <div style={{columns: 2}}>
              {lessons.filter(l => l.unit > 2).map(lesson => {
                return <LessonListItemWrapper key={lesson.slug} to={`/${langId}/lessons/${lesson.slug}`}>
                  {lesson.title_eng || 'Unknown'}
                </LessonListItemWrapper>
              })}
            </div>
          </LessonUnitWrapper>
        </LessonListWrapper>
        <div>
          <p>{lessons?.length || 0} lesson{lessons?.length !== 1 && 's'}</p>
          { user && <Link to={`/${langId}/lessons/new`}>+ Add lesson</Link> }
          <hr />
          <p style={{fontSize: 'small'}}>
            Lessons are free to use under a Creative Commons license.
            {' '}
            <Link to={`/open-source`}>Browse data downloads</Link>
          </p>
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
const LessonUnitWrapper = styled.div`
  margin: 0 0 2rem;
`
const LessonListItemWrapperBig = styled(Link)`
  /* border: 1px solid;
  padding: 1rem;
  text-decoration: none;
  min-height: 40px;
  margin: 0 0 1rem;
  box-shadow: 1px 1px; */
  display: block;
`
const LessonListItemWrapper = styled(Link)`
  /* border: 1px solid; */
  /* padding: 1rem; */
  /* text-decoration: none; */
  /* min-height: 100px; */
  display: block;
`
