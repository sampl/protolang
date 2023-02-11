import SpeakWord from '../dictionary/SpeakWord'
import Definable from './Definable'

export default ({ it, en }) => {

  // TODO - find associated phrase and use its data for everything here

  return <span style={{display: 'block', border: '1px solid', padding: '.5rem', margin: '0 0 -1px 0'}}>
    <Definable wordString={it} />
    {' '}
    <SpeakWord wordString={it} disabled={!it} />
    { en && !it && `TODO - translate ${en}`}
  </span>
}
