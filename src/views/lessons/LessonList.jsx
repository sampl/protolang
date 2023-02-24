import { Link, useParams } from 'react-router-dom'
import styled from 'styled-components/macro'
import {groupBy} from 'lodash'

import { supabase, useSupabaseQuery } from '@/db/supabase'
import { TwoColumns } from '@/styles/Layout'
import SuggestedLessons from './SuggestedLessons'
import QuickLinks from "./QuickLinks"

export default () => {
  const { langId } = useParams()

  const query = supabase
    .from('lessons')
    .select()
    .eq('language_id', langId)
    .order('sort_order',  { ascending: true })
  const [lessons, loading, error] = useSupabaseQuery(query, [langId])

  const groupedLessons = groupBy(lessons, l => l.unit)
  const units = Object.keys(groupedLessons)
    .map(k => ({ key: k, lessons: groupedLessons[k]}))
    .map(g => ({
      ...g,
      title:  g.key === '0' ? 'Start here' : 
              g.key === '1' ? 'Beginner' :
              g.key === '2' ? 'Moderate' :
              g.key === '3' ? 'Advanced' :
              'Bonus unit',
    }))

  return <>
    <QuickLinks />
    <br />
    {
      error ? error.message :
      loading ? 'loading...' :
      <TwoColumns cols="5fr 2fr">
        <LessonListWrapper>
          {
            (!lessons || lessons.length) <= 0 ? 'no lessons' :
            <>
              <SuggestedLessons />
              {units?.map(unit => {
                return <LessonUnitWrapper key={unit.key}>
                  <h2>{unit.title}</h2>
                  {unit.lessons.map(lesson => {
                    return <LessonListItemWrapper key={lesson.slug} to={`/${langId}/lessons/${lesson.slug}`}>
                      {lesson.title_en || 'Unknown'}
                    </LessonListItemWrapper>
                  })}
                </LessonUnitWrapper>
              })}
            </>
          }
        </LessonListWrapper>
        <div>
          <p>{lessons?.length || 0} lesson{lessons?.length !== 1 && 's'}</p>
          <Link to={`/${langId}/lessons/new`}>+ Add lesson</Link>
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
const LessonListItemWrapper = styled(Link)`
  /* border: 1px solid; */
  /* padding: 1rem; */
  /* text-decoration: none; */
  /* min-height: 100px; */
  display: block;
`
