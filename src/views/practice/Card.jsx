import styled from 'styled-components/macro'

import ReportIssue from '@/views/practice/ReportIssue'
import SpeakWord from '@/views/dictionary/SpeakWord'
import { useUser } from '@/_state/user'
import MnemonicSuggested from '@/views/mnemonics/MnemonicSuggested'
import Definable from '@/views/lessons/Definable'
import PhraseEdit from '@/views/practice/PhraseEdit'

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
  practiceType,
  lessonEmbed,
}) => {

  const { isAdmin } = useUser()

  if (placeInLine > STACK_SIZE) return null
  const isLastCard = placeInLine === STACK_SIZE
  const SPEED = '.3s'

  const translateCardPrompt = `${cardAnswerType === 'text' ? 'Type' : cardAnswerType === 'speech' ? 'Speak' : 'Give'} the ${direction === 'forward' ? 'Italian' : 'English'} for...`

  return <CardWrapper style={{
    padding: lessonEmbed ? '1rem' : '2rem',
    position: lessonEmbed ? 'relative' : 'absolute',
    boxShadow: lessonEmbed && '1px 1px',
    visibility: (isDone && !isRecentlyDone) ? 'hidden' : 'visible',
    pointerEvents: isRecentlyDone ? 'none' : 'auto',
    transform: isRecentlyDone ? `translate(${placeInLine * 8}px, ${placeInLine * 8}px)` : `translate(${placeInLine * 4}px, ${placeInLine * 4}px)`,
    opacity: (isLastCard || isRecentlyDone) ? 0 : 1,
    zIndex: 100 - placeInLine,
    transition: `visibility 0s, opacity ${SPEED} ease-in-out, transform ${SPEED} ease-in-out`,
  }}>

    {practiceType === 'translation' && <p>{translateCardPrompt}</p>}

    <div style={{ position: 'absolute', top: '1rem', right: '1rem', fontSize: 'small'}}>
      <ReportIssue phrase={phrase} />
      {' '}
      {isAdmin && <PhraseEdit phrase={phrase} />}
    </div>

    {
      practiceType === 'pronunciation' && <>
        <div>
          {(cardQuestionType === 'text' || cardQuestionType === 'both') && <strong><Definable wordString={phrase.content_ita} /></strong>}
          {(cardQuestionType === 'audio' || cardQuestionType === 'both') && <SpeakWord wordString={phrase.content_ita} />}
        </div>
        <div style={{fontSize: 'small'}}>
          {phrase.content_ita_alts && phrase.content_ita_alts.length > 0 && 'or '}
          {phrase.content_ita_alts?.join(', ') || ""}
        </div>
        <p>{phrase.content_eng}</p>
        <div style={{fontSize: 'small'}}>
          {phrase.content_eng_alts && phrase.content_eng_alts.length > 0 && 'or '}
          {phrase.content_eng_alts?.join(', ') || ""}
        </div>
        <MnemonicSuggested string={phrase.content_ita} />
      </>
    }
    {
      practiceType === 'translation' && <>
        {
          cardQuestionType === 'text' ? <h2>{question}</h2> :
          cardQuestionType === 'audio' ? <SpeakWord wordString={question} /> :
          <h2>
            {question}
            {direction !== 'forward' && <SpeakWord wordString={question} />}
          </h2>
        }
      </>
    }
  </CardWrapper>
}

export const CardWrapper = styled.div`
  border: 1px solid;
  background: white;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`
