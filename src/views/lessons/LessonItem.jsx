import { useParams } from 'react-router-dom'
import { useFilter, useSelect } from 'react-supabase'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkDirective from 'remark-directive'
import remarkDirectiveRehype from 'remark-directive-rehype'
import LessonEmbed from './LessonEmbed'
import { BreadcrumbItem, BreadcrumbSeparator, BreadcrumbWrapper } from '@/styles/Breadcrumbs'

export default () => {
  let { id } = useParams()

  const filter = useFilter(
    (query) => query.eq('id', id),
    [id],
  )

  const [{ data, error, fetching }] = useSelect('lessons', {
    filter,
  })

  const lesson = data && data[0]

  return <>
    <BreadcrumbWrapper>
      <BreadcrumbItem to="/lessons">Lessons</BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem to={`/lessons/${id}`}>{lesson?.title_en}</BreadcrumbItem>
    </BreadcrumbWrapper>

    {error && error.message}
    {fetching && 'loading...'}

    <h1>{lesson?.title_en}</h1>

    <ReactMarkdown
      children={lesson?.content_en || ''}
      remarkPlugins={[remarkGfm, remarkDirective, remarkDirectiveRehype]}
      components={{
        'word': LessonEmbed,
      }}
    />

  </>
}
