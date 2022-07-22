import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import SpeakWord from '../words/SpeakWord'

export default ({ lessonBlock }) => {

  return <>
    <ReactMarkdown remarkPlugins={[remarkGfm]}>
      {lessonBlock.content_en}
    </ReactMarkdown>

    {lessonBlock?.words?.map(wordString => <div key={wordString}>
      {wordString}
      <SpeakWord wordString={wordString} />
    </div>)}

    <hr />
  </>
}
