import { useState } from 'react'
import { Link } from 'react-router-dom'

import { supabase } from '@/_util/supabaseClient'
import Card from '@/styles/Card'
import { useUser } from '@/_state/user'
import ReportError from '@/views/practice/ReportError'
import CardText from './card_types/CardText'
import CardSpeech from './card_types/CardSpeech'

const MAX_STRIKES = 1

// https://stackoverflow.com/a/37511463/1061063
const normalizeString = string => string.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase()

export default ({ word, type, next }) => {
  const { user } = useUser()

  // waiting, try_again, correct, incorrect
  const [cardState, setCardState] = useState('waiting')
  const [strikes, setStrikes] = useState(0)
  const [isReportingError, setIsReportingError] = useState()

  const testAnswer = answer => {
    return normalizeString(word?.name) === normalizeString(answer)
  }

  const testPartialAnswer = answer => {
    return normalizeString(word?.name).startsWith(normalizeString(answer))
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
      word={word}
      disabled={disabled}
      testAnswer={testAnswer}
      testPartialAnswer={testPartialAnswer}
      submitAnswer={submitAnswer}
    />
    <br />
    {
      cardState === "correct" ? <>
        You're right!
        <Link to={`/words/${word?.id}`}>go to word</Link>
        <br />
        <button autoFocus onClick={next}>Next</button>
      </>
      :
      cardState === "try_again" ? <>
        Not quite, try again...
      </>
      :
      cardState === "incorrect" ? <>
        Whoops not quite. The answer is "{word.name}"
        <Link to={`/words/${word?.id}`}>go to word</Link>
        <button autoFocus onClick={next}>Next</button>
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
