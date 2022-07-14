import { useParams } from 'react-router-dom'
import { useFilter, useSelect } from 'react-supabase'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default () => {
  let { id } = useParams()

  const filter = useFilter(
    (query) => query.eq('id', id),
    [id],
  )

  const [{ data, error, fetching }] = useSelect('lessons', {
    columns: '*, user_lessons(*)',
    filter,
  })

  const lesson = data && data[0]

  return <>
    {error && error.message}
    {fetching && 'loading...'}

    <h1>{lesson && lesson.title_en}</h1>

    <ReactMarkdown remarkPlugins={[remarkGfm]}>
      {lesson && lesson.content_en}
    </ReactMarkdown>

  </>
}
