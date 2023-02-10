import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkDirective from 'remark-directive'
import remarkDirectiveRehype from 'remark-directive-rehype'
import LessonEmbed from './LessonEmbed'
import LessonVideo from './LessonVideo'

export default ({ content }) => {
  return <>
    <ReactMarkdown
      children={content}
      remarkPlugins={[remarkGfm, remarkDirective, remarkDirectiveRehype]}
      components={{
        'word': LessonEmbed, // rename to phrase?
        'video': LessonVideo,
      }}
    />
  </>
}
