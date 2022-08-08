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

export default ({ word, type, direction, next }) => {

  const question =      direction === 'forward' ? word?.translation_en : word?.name 
  const correctAnswer = direction === 'forward' ? word?.name : word?.translation_en 

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

  const submitAnswer = answer => {
    const correct = testAnswer(answer)
    if (!correct && strikes < MAX_STRIKES) {
      setStrikes(s => s + 1)
      setCardState('try_again')
      return
    }
    setCardState(correct ? 'correct' : 'incorrect')
    saveAnswer(type, correct)
  }

  const saveAnswer = async (type, correct) => {
    if (!user) {
      return
    }
    try {
      const newData = {
        type,
        created_by: user.id,
        word: word?.id,
        correct,
      }
      let { error } = await supabase.from('attempts').insert([newData])
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
      key={word?.id}
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
        <Link to={`/${currentLanguage.code}/words/${word && encodeURIComponent(word.name)}`}>go to word</Link>
        <br />
        <Button autoFocus onClick={next}>Next</Button>
      </>
      :
      cardState === "try_again" ? <>
        Not quite, try again...
      </>
      :
      cardState === "incorrect" ? <>
        Whoops not quite. The answer is "{word.name}"
        <Link to={`/${currentLanguage.code}/words/${word && encodeURIComponent(word.name)}`}>go to word</Link>
        <Button autoFocus onClick={next}>Next</Button>
      </>
      :
      null
    }
    {
      (cardState === "correct" || cardState === "incorrect") && 
      isReportingError && 
      <ReportError word={word} close={() => setIsReportingError(false)} />
    }
    <br /><span onClick={next}>skip</span>
  </Card>
}
