import { useParams } from 'react-router-dom'
import { BreadcrumbItem, BreadcrumbSeparator, BreadcrumbWrapper } from '@/styles/Breadcrumbs'
import { Link } from 'react-router-dom'
import moment from 'moment'

import { supabase, useSupabaseQuery } from '@/db/supabase'
import LessonContent from './LessonContent'
import { TwoColumns } from '@/styles/Layout'
import { useUser } from "@/_state/user"
import { Badge } from '@/styles/Badge'
import LessonAdminEdit from './LessonAdminEdit'

export default () => {
  const { lessonString, langId } = useParams()
  const { user, isAdmin } = useUser()

  const slug = lessonString.split('-').pop()

  const query = supabase
    .from('lessons')
    .select('*, current_edit(*, created_by(*)), created_by(*)')
    .eq('slug', slug)
    .single()
  const [lesson, loading, error] = useSupabaseQuery(query, [slug])

  console.log(lesson)
  return <>
    <BreadcrumbWrapper>
      <BreadcrumbItem to={`/${langId}/lessons`}>Lessons</BreadcrumbItem>
      <BreadcrumbSeparator />
      {lesson?.title_eng}
    </BreadcrumbWrapper>

    {error && error.message}
    {loading && 'loading...'}

    <h1>{lesson?.title_eng}</h1>
    {lesson?.title_ita && <p>{lesson.title_ita}</p> }

    <hr />

    <TwoColumns cols="2fr 1fr">
      <div>
        <LessonContent content={lesson?.current_edit?.content_eng || ''} />
      </div>
      <div>
        {lesson?.current_edit?.topics?.map(topic => <Badge key="topic">{topic}</Badge>)}

        <br />

        Created {moment(lesson?.created_at).format("MMMM Do, YYYY")}
        {' '}
        by
        {' '}
        { lesson?.created_by?.username ?
          <Link to={`/u/${lesson?.created_by.username}`}>{lesson?.created_by.username}</Link> :
          '❌ no username'
        }

        <br />

        Last edit {moment(lesson?.current_edit?.created_at).format("MMMM Do, YYYY")}
        {' '}
        by
        {' '}
        { lesson?.current_edit?.created_by?.username ?
          <Link to={`/u/${lesson?.current_edit?.created_by.username}`}>{lesson?.current_edit?.created_by.username}</Link> :
          '❌ no username'
        }

        <br />
        <Link to={`/${langId}/lessons/${lesson?.slug}/history`}>History</Link>
        <br />
        { user && <Link to={`/${langId}/lessons/${lesson?.slug}/edit`}>Edit lesson</Link> }
        <br />
        { lesson && isAdmin && <p><LessonAdminEdit lesson={lesson} /></p> }
      </div>
    </TwoColumns>
  </>
}
