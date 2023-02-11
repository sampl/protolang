import Popover from '@/styles/Popover'
import MiniDefinition from '../dictionary/MiniDefinition'
import styled from 'styled-components/macro'

export default ({ wordString }) => {
  const words = wordString?.split(' ')
  return <>
    {words?.map((word, i) => {
      return <span key={i}>
        <Popover
          target={<Word>{word}</Word>}
          content={<MiniDefinition name={word} />}
        />
        {' '}
      </span>
    })}
  </>
}

export const Word = styled.span`
  cursor: pointer;
  display: inline-block;
  font-weight: bold;
  text-decoration-style: dotted;
  text-decoration-line: underline;
  text-decoration-color: inherit;
`
