import { useParams } from 'react-router-dom'
import { useFilter, useSelect } from 'react-supabase'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import Layout from '@/_layout/Layout'

export default () => {
  let { id } = useParams()

  const filter = useFilter(
    (query) => query.eq('id', id),
    [id],
  )

  const [{ data, error, fetching }] = useSelect('lessons', { filter })

  const lesson = data && data[0]

  return <Layout>
    {error && error.message}
    {fetching && 'loading...'}

    <h1>{lesson && lesson.title_en}</h1>

    <ReactMarkdown remarkPlugins={[remarkGfm]}>
      {lesson && lesson.content_en}
    </ReactMarkdown>

  </Layout>
}
