import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components/macro'

import { supabase } from '@/db/supabase'
import { useUser } from '@/_state/user'
import ReportIssue from '@/views/practice/ReportIssue'
import CardAnswerText from './card_answer_types/CardAnswerText'
import CardAnswerSpeech from './card_answer_types/CardAnswerSpeech'
import { useLanguage } from '@/_state/language'
import { Button } from '@/styles/Button'
import SpeakWord from '@/views/dictionary/SpeakWord'
import { TwoColumns } from '@/styles/Layout'

const MAX_STRIKES = 1
const STACK_SIZE = 3

// https://stackoverflow.com/a/37511463/1061063
const normalizeString = string => string.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase()

export default ({
  phrase,
  cardQuestionType,
  cardAnswerType,
  direction,
  next,
  placeInLine,
  isCurrent,
  isDone,
  setPhraseToShowInfoAbout,
  isRecentlyDone,
}) => {

  const question =      direction === 'forward' ? phrase?.content_en : phrase?.content_it 
  const correctAnswer = direction === 'forward' ? phrase?.content_it : phrase?.content_en 

  const { user } = useUser()
  const { currentLanguage } = useLanguage()

  // waiting, try_again, correct, incorrect
  const [cardState, setCardState] = useState('waiting')
  const [strikes, setStrikes] = useState(0)

  const testAnswer = answer => {
    return normalizeString(correctAnswer) === normalizeString(answer)
  }

  const testPartialAnswer = answer => {
    return normalizeString(correctAnswer).startsWith(normalizeString(answer))
  }

  const submitAnswer = async answer => {
    console.log('SUBMITTING ANSWER', answer)
    const correct = testAnswer(answer)
    if (!correct && strikes < MAX_STRIKES) {
      setStrikes(s => s + 1)
      setCardState('try_again')
      return
    }
    setCardState(correct ? 'correct' : 'incorrect')
    setPhraseToShowInfoAbout(phrase)

    if (!user) {
      return
    }
    try {
      const newData = {
        language_id: currentLanguage.id,
        phrase: phrase?.id,
        direction,
        prompt_type: cardQuestionType,
        repeated_only: false, // TODO - built repeat-only attempts
        guess: answer.trim(),
        is_correct: correct,
        answer_type: cardAnswerType,
        // perfect_answer, // TODO - return in test algo
        // with_hint, // TODO - detect hints
        second_try: strikes > 0,
        created_by: user.id,
      }
      const { error } = await supabase
        .from('phrase_attempts')
        .insert([newData])
      if (error) {
        throw error
      }
    } catch (error) {
      console.error(error.message)
    }
  }

  const disabled = cardState === 'correct' || cardState === 'incorrect'

  const CardAnswerComponent = cardAnswerType === 'text' ? CardAnswerText : CardAnswerSpeech

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
    <br />

    {/* don't initialize any fancy voice stuff if it's not the current card, that way leads to pain */}
    {isCurrent &&
      <CardAnswerComponent
        key={phrase?.id}
        id={phrase?.id}
        direction={direction}
        question={question}
        correctAnswer={correctAnswer}
        disabled={disabled}
        testAnswer={testAnswer}
        testPartialAnswer={testPartialAnswer}
        submitAnswer={submitAnswer}
      />
    }

    {/* <hr /> */}

    <TwoColumns cols="auto max-content">
      <div>
        {
          cardState === "try_again" ? <>
            Not quite, try again...
          </>
          :
          cardState === "correct" ? <>
            You're right!
            {' · '}
            <Button autoFocus onClick={next}>Next</Button>
          </>
          :
          cardState === "incorrect" ? <>
            Whoops not quite. The answer is "{correctAnswer}"
            {' · '}
            <Button autoFocus onClick={next}>Next</Button>
          </>
          :
          null
        }
      </div>
      <div>
        {
          (cardState === "waiting" || cardState === "try_again") && 
          <div onClick={next}>skip</div>
        }
      </div>
    </TwoColumns>
  </CardWrapper>
}


export const CardWrapper = styled.div`
  border: 1px solid;
  padding: 1rem;
  background: white;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* box-shadow: 1px 1px; */
`
