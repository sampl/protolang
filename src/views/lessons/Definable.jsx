import styled from 'styled-components/macro'

import { useReferencePanel } from '@/_state/reference'

export default ({ wordString }) => {

  const { setMode, setQuery, setReferenceIsOpen } = useReferencePanel()

  if (!wordString) return 'Error: no wordString'

  const words = wordString.split(' ')

  return <>
    {words.map((word, i) => {
      // https://stackoverflow.com/questions/4328500/how-can-i-strip-all-punctuation-from-a-string-in-javascript-using-regex
      const lookupWord = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").toLowerCase()
      return <span key={i}>
        <Word onClick={() => {
          setMode('dictionary')
          setQuery(lookupWord)
          setReferenceIsOpen(true)
        }}>{word}</Word>
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
