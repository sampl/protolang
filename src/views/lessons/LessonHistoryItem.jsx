import { Link, useParams } from 'react-router-dom'
import { BreadcrumbItem, BreadcrumbSeparator, BreadcrumbWrapper } from '@/styles/Breadcrumbs'
import moment from 'moment'
import * as Diff from 'diff'

import { supabase, useSupabaseQuery } from '@/db/supabase'
// import LessonContent from './LessonContent'
import { TwoColumns } from '@/styles/Layout'

export default () => {
  const { lessonString, langId, editId } = useParams()

  const slug = lessonString.split('-').pop()

  const lessonQuery = supabase
    .from('lessons')
    .select()
    .eq('slug', slug)
    .single()
  const [lesson, lessonLoading, lessonError] = useSupabaseQuery(lessonQuery, [slug])

  const lessonEditQuery = supabase
    .from('lesson_edits')
    .select('*, created_by(*)')
    .eq('id', editId)
    .single()
  const [lessonEdit, lessonEditLoading, lessonEditError] = useSupabaseQuery(lessonEditQuery)

  const prevLessonEditQuery = supabase
    .from('lesson_edits')
    .select()
    .eq('lesson_id', lesson?.id)
    .lt('created_at', lessonEdit?.created_at)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()
  const [prevLessonEdit, prevLessonEditLoading, prevLessonEditError] = useSupabaseQuery(prevLessonEditQuery, [lessonEdit], (!lessonEdit || !lesson))

  if (lessonError) return "Error: lessonError - " + lessonError.message
  if (lessonEditError) return "Error: lessonEditError - " + lessonEditError.message
  if (lessonEditLoading || lessonLoading || prevLessonEditLoading) return 'loading...'

  let diff = null
  if (lessonEdit && prevLessonEdit) {
    diff = Diff.diffLines(prevLessonEdit.content_eng, lessonEdit.content_eng) 
  }

  return <>
    <BreadcrumbWrapper>
      <BreadcrumbItem to={`/${langId}/lessons`}>Lessons</BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem to={`/${langId}/lessons/${slug}`}>{lesson?.title_eng}</BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem to={`/${langId}/lessons/${slug}/history`}>History</BreadcrumbItem>
      <BreadcrumbSeparator />
      {lessonEdit?.id}
    </BreadcrumbWrapper>

    <h1>Edit #{lessonEdit?.id}</h1>
    Created {moment(lessonEdit?.created_at).format("MMMM Do, YYYY")}
    {' '}
    by
    {' '}
    { lessonEdit.created_by?.username ?
      <Link to={`/u/${lessonEdit.created_by.username}`}>{lessonEdit.created_by.username}</Link> :
      '❌ no username'
    }

    <hr />

    <TwoColumns cols="1fr 1fr">
      <div style={{fontFamily: 'monospace', whiteSpace: 'break-spaces'}}>
        {diff?.map((part, i) => <div key={i}>
          {
            part.added ? '' :
            part.removed ? <span style={{fontWeight: 'bold', color: 'red', background: 'hsla(0, 80%, 60%, .1)'}}>{part.value}</span> :
            part.value
          }
        </div>)}
        {/* {prevLessonEdit?.content_eng || ''} */}
      </div>
      <div style={{fontFamily: 'monospace', whiteSpace: 'break-spaces'}}>
        {diff?.map((part, i) => <div key={i}>
          {
            part.added ? <span style={{fontWeight: 'bold', color: 'green', background: 'hsla(120, 60%, 60%, .1)'}}>{part.value}</span> :
            part.removed ? '' :
            part.value
          }
        </div>)}

        {/* when this is the first edit */}
        {!diff && lessonEdit?.content_eng || ''}
      </div>
    </TwoColumns>

    <hr />

    {/* <TwoColumns cols="1fr 1fr">
      <div>
        <LessonContent content={prevLessonEdit?.content_eng || ''} />
      </div>
      <div>
        <LessonContent content={lessonEdit?.content_eng || ''} />
      </div>
    </TwoColumns> */}
  </>
}
