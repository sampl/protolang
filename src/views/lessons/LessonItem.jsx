import { useParams } from 'react-router-dom'
import { useFilter, useSelect } from 'react-supabase'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import LessonBlock from '@/views/lessons/LessonBlock'

export default () => {
  let { id } = useParams()

  const filter = useFilter(
    (query) => query.eq('id', id),
    [id],
  )

  const [{ data, error, fetching }] = useSelect('lessons', {
    columns: '*, user_lessons(*), lesson_blocks(*)',
    filter,
  })

  const lesson = data && data[0]
  const completed = lesson?.user_lessons && lesson.user_lessons[0]?.completed

  return <>
    {error && error.message}
    {fetching && 'loading...'}

    <h1>{lesson?.title_en} {completed && '✅'}</h1>

    <ReactMarkdown remarkPlugins={[remarkGfm]}>
      {lesson?.content_en || ''}
    </ReactMarkdown>
    
    <hr />

    {lesson?.lesson_blocks.map(lessonBlock => (
      <LessonBlock key={lessonBlock.id} lessonBlock={lessonBlock} />
    ))}
  </>
}
