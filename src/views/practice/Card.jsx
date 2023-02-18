import { useState } from 'react'
import { Link } from 'react-router-dom'

import { supabase } from '@/db/supabase'
import Card from '@/styles/Card'
import { useUser } from '@/_state/user'
import ReportIssue from '@/views/practice/ReportIssue'
import CardAnswerText from './card_answer_types/CardAnswerText'
import CardAnswerSpeech from './card_answer_types/CardAnswerSpeech'
import { useLanguage } from '@/_state/language'
import { Button } from '@/styles/Button'
import SpeakWord from '@/views/dictionary/SpeakWord'
import { TwoColumns } from '@/styles/Layout'

const MAX_STRIKES = 1

// https://stackoverflow.com/a/37511463/1061063
const normalizeString = string => string.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase()

export default ({ phrase, cardQuestionType, cardAnswerType, direction, next }) => {

  const question =      direction === 'forward' ? phrase?.content_en : phrase?.content_it 
  const correctAnswer = direction === 'forward' ? phrase?.content_it : phrase?.content_en 

  const { user } = useUser()
  const { currentLanguage } = useLanguage()

  // waiting, try_again, correct, incorrect
  const [cardState, setCardState] = useState('waiting')
  const [strikes, setStrikes] = useState(0)
  const [isReportingIssue, setIsReportingIssue] = useState()

  const testAnswer = answer => {
    return normalizeString(correctAnswer) === normalizeString(answer)
  }

  const testPartialAnswer = answer => {
    return normalizeString(correctAnswer).startsWith(normalizeString(answer))
  }

  const submitAnswer = async answer => {
    const correct = testAnswer(answer)
    const wasSecondTry = strikes > 0
    if (!correct && strikes < MAX_STRIKES) {
      setStrikes(s => s + 1)
      setCardState('try_again')
      return
    }
    setCardState(correct ? 'correct' : 'incorrect')

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
        guess: answer,
        is_correct: correct,
        answer_type: cardAnswerType,
        // perfect_answer, // TODO - return in test algo
        // with_hint, // TODO - detect hints
        second_try: wasSecondTry,
        created_by: user.id,
      }
      const { error } = await supabase
        .from('practice_attempts')
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

  return <Card>

    <TwoColumns cols="auto max-content">
      <p>{cardAnswerType === 'text' ? 'Type' : 'Speak'} the {direction === 'forward' ? 'Italian' : 'English'} for...</p>
      <div>
        <button onClick={() => setIsReportingIssue(true)}>Report issue</button>
        {
          isReportingIssue && 
          <ReportIssue phrase={phrase} close={() => setIsReportingIssue(false)} />
        }
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
    <CardAnswerComponent
      key={phrase?.id}
      direction={direction}
      question={question}
      correctAnswer={correctAnswer}
      disabled={disabled}
      testAnswer={testAnswer}
      testPartialAnswer={testPartialAnswer}
      submitAnswer={submitAnswer}
    />

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
            <Link to={`/${currentLanguage.id}/practice/${phrase?.id}`}>go to phrase</Link>
            <br />
            <Button autoFocus onClick={next}>Next</Button>
          </>
          :
          cardState === "incorrect" ? <>
            Whoops not quite. The answer is "{correctAnswer}"
            {' · '}
            <Link to={`/${currentLanguage.id}/practice/${phrase?.id}`}>go to phrase</Link>
            <br />
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
  </Card>
}
