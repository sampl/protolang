import SpeakWord from '../words/SpeakWord'
import Popover from '@/styles/Popover'
import {Word} from '@/styles/Word'
import WordMini from '../words/WordMini'

export default ({ it, en }) => {
  return <span style={{display: 'block', border: '1px solid', padding: '.5rem'}}>
    <Popover
      target={<Word>{it || '(Unknown word)'}</Word>}
      content={<WordMini wordString={it} />}
    />
    {' '}
    <SpeakWord wordString={it} disabled={!it} />
    { en && !it && `TODO - translate this from English: ${en}`}
  </span>
}
