import styled from 'styled-components/macro'

import ReportIssue from '@/views/practice/ReportIssue'
import SpeakWord from '@/views/dictionary/SpeakWord'
import { TwoColumns } from '@/styles/Layout'

const STACK_SIZE = 3

export default ({
  phrase,
  cardQuestionType,
  cardAnswerType,
  direction,
  placeInLine,
  isDone,
  isRecentlyDone,
  question,
}) => {

  if (placeInLine > STACK_SIZE) return null
  const isLastCard = placeInLine === STACK_SIZE
  const SPEED = '.3s'

  return <CardWrapper style={{
    visibility: (isDone && !isRecentlyDone) ? 'hidden' : 'visible',
    pointerEvents: isRecentlyDone ? 'none' : 'auto',
    transform: isRecentlyDone ? `translate(${placeInLine * 8}px, ${placeInLine * 8}px)` : `translate(${placeInLine * 4}px, ${placeInLine * 4}px)`,
    opacity: (isLastCard || isRecentlyDone) ? 0 : 1,
    zIndex: 100 - placeInLine,
    transition: `visibility 0s, opacity ${SPEED} ease-in-out, transform ${SPEED} ease-in-out`,
  }}>

    <TwoColumns cols="auto max-content">
      <p>{cardAnswerType === 'text' ? 'Type' : 'Speak'} the {direction === 'forward' ? 'Italian' : 'English'} for...</p>
      <div>
        <ReportIssue phrase={phrase} />
      </div>
    </TwoColumns>

    {
      cardQuestionType === 'text' ? <h2>{question}</h2> :
      cardQuestionType === 'audio' ? <SpeakWord wordString={question} /> :
      <h2>
        {question}
        {direction !== 'forward' && <SpeakWord wordString={question} />}
      </h2>
    }
  </CardWrapper>
}

export const CardWrapper = styled.div`
  border: 1px solid;
  padding: 2rem;
  background: white;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* box-shadow: 1px 1px; */
`
