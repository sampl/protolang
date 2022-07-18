import { useState } from 'react'
import { Link } from 'react-router-dom'

import { supabase } from '@/_util/supabaseClient'
import Card from '@/styles/Card'
import { useUser } from '@/_state/user'
import ReportError from '@/views/practice/ReportError'
import CardText from './card_types/CardText'

const MAX_STRIKES = 1

export default ({ word, type, next }) => {
  const { user } = useUser()

  // waiting, try_again, correct, incorrect
  const [cardState, setCardState] = useState('waiting')
  const [strikes, setStrikes] = useState(0)
  const [isReportingError, setIsReportingError] = useState()

  const answer = (answer) => {
    const correct = word.name === answer.trim().toLowerCase()
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

  const CardComponent = type === 'text' ? CardText : CardText

  return <Card>
    <CardComponent
      type={type}
      word={word}
      cardState={cardState}
      answer={answer}
    />
    {
      cardState === "correct" ? <>
        You're right!
        <Link to={`/words/${word?.id}`}>go to word</Link>
        <button autoFocus onClick={next}>Next</button>
      </>
      :
      cardState === "try_again" ? <>
        Not quite, try again...
      </>
      :
      cardState === "incorrect" ? <>
        Whoops not quite. The answer is "{word.translation_en}"
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
  </Card>
}
