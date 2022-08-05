import SpeakWord from '../words/SpeakWord'
import Popover from '@/styles/Popover'
import {Word} from '@/styles/Word'
import WordMini from '../words/WordMini'

export default props => {
  const { it, en } = props
  return <span style={{display: 'block', background: '#eee'}}>
    <Popover
      target={<Word>{it || '(Unknown word)'}</Word>}
      content={<WordMini wordString={it} />}
    />
    <SpeakWord wordString={it} disabled={!it} />
    { en && !it && `TODO - translate this from English: ${en}`}
  </span>
}
