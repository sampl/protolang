import SpeakWord from '../dictionary/SpeakWord'
import Popover from '@/styles/Popover'
import {Word} from '@/styles/Word'
import MiniDefinition from '../dictionary/MiniDefinition'

export default ({ it, en }) => {

  // TODO - find associated phrase and use its data for everything here

  return <span style={{display: 'block', border: '1px solid', padding: '.5rem', margin: '0 0 -1px 0'}}>
    <Popover
      target={<Word>{it || '(Unknown word)'}</Word>}
      content={<MiniDefinition name={it} />}
    />
    {' '}
    <SpeakWord wordString={it} disabled={!it} />
    { en && !it && `TODO - translate this from English: ${en}`}
  </span>
}
