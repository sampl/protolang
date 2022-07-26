import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import SpeakWord from '../words/SpeakWord'
import Popover from '@/styles/Popover'
import {Word} from '@/styles/Word'
import WordMini from '../words/WordMini'

export default ({ lessonBlock }) => {

  return <>
    <ReactMarkdown remarkPlugins={[remarkGfm]}>
      {lessonBlock.content_en}
    </ReactMarkdown>

    {lessonBlock?.words?.map(wordString => <div key={wordString}>
      <Popover
        target={<Word>{wordString}</Word>}
        content={<WordMini wordString={wordString} />}
      />
      <SpeakWord wordString={wordString} />
    </div>)}

    <hr />
  </>
}
