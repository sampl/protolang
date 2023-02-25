import Popover from '@/styles/Popover'
import MiniDefinition from '../dictionary/MiniDefinition'
import styled from 'styled-components/macro'

export default ({ wordString }) => {
  if (!wordString) return 'Error: no wordString'
  const words = wordString
    .split(' ')

  return <>
    {words.map((word, i) => {
      // https://stackoverflow.com/questions/4328500/how-can-i-strip-all-punctuation-from-a-string-in-javascript-using-regex
      const lookupWord = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").toLowerCase()
      return <span key={i}>
        <Popover
          target={<Word>{word}</Word>}
          content={<MiniDefinition name={lookupWord} />}
        />
        {' '}
      </span>
    })}
  </>
}

export const Word = styled.span`
  cursor: pointer;
  display: inline-block;
  /* font-weight: bold; */
  text-decoration-style: dotted;
  text-decoration-line: underline;
  text-decoration-color: inherit;
`
