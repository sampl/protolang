import { useState } from 'react'
import { Link } from 'react-router-dom'

import { supabase } from '@/_util/supabaseClient'
import Card from '@/styles/Card'
import { useUser } from '@/_state/user'
import ReportError from '@/views/practice/ReportError'
import CardText from './card_types/CardText'
import CardSpeech from './card_types/CardSpeech'
import { useLanguage } from '@/_state/language'
import { Button } from '@/styles/Button'

const MAX_STRIKES = 1

// https://stackoverflow.com/a/37511463/1061063
const normalizeString = string => string.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase()

export default ({ phrase, type, direction, next }) => {

  const question =      direction === 'forward' ? phrase?.translation_en : phrase?.name 
  const correctAnswer = direction === 'forward' ? phrase?.name : phrase?.translation_en 

  const { user } = useUser()
  const { currentLanguage } = useLanguage()

  // waiting, try_again, correct, incorrect
  const [cardState, setCardState] = useState('waiting')
  const [strikes, setStrikes] = useState(0)
  const [isReportingError, setIsReportingError] = useState()

  const testAnswer = answer => {
    return normalizeString(correctAnswer) === normalizeString(answer)
  }

  const testPartialAnswer = answer => {
    return normalizeString(correctAnswer).startsWith(normalizeString(answer))
  }

  const submitAnswer = async answer => {
    // debugger
    const correct = testAnswer(answer)
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
        language: currentLanguage.id,
        phrase: phrase?.id,
        guess: answer,
        is_correct: correct,
        created_by: user.id,
      }
      let { error } = await supabase.from('practice_attempts').insert([newData])
      if (error) {
        throw error
      }
    } catch (error) {
      console.error(error.message)
    }
  }

  const disabled = cardState === 'correct' || cardState === 'incorrect'

  const CardComponent = type === 'text' ? CardText : CardSpeech

  return <Card>
    <CardComponent
      key={phrase?.id}
      type={type}
      direction={direction}
      question={question}
      correctAnswer={correctAnswer}
      disabled={disabled}
      testAnswer={testAnswer}
      testPartialAnswer={testPartialAnswer}
      submitAnswer={submitAnswer}
    />
    <br />
    {
      cardState === "correct" ? <>
        You're right!
        <Link to={`/${currentLanguage.id}/practice/${phrase?.id}`}>go to phrase</Link>
        <br />
        <Button autoFocus onClick={next}>Next</Button>
      </>
      :
      cardState === "try_again" ? <>
        Not quite, try again...
      </>
      :
      cardState === "incorrect" ? <>
        Whoops not quite. The answer is "{correctAnswer}"
        <Link to={`/${currentLanguage.id}/practice/${phrase?.id}`}>go to phrase</Link>
        <Button onClick={() => setIsReportingError(true)}>Report error</Button>
        <Button autoFocus onClick={next}>Next</Button>
      </>
      :
      null
    }
    {
      (cardState === "correct" || cardState === "incorrect") && 
      isReportingError && 
      <ReportError phrase={phrase} close={() => setIsReportingError(false)} />
    }
    <br /><span onClick={next}>skip</span>
  </Card>
}
