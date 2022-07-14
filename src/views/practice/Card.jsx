import { useState } from 'react'
import { Link } from 'react-router-dom'

import { supabase } from '@/_util/supabaseClient'
import Card from '@/styles/Card'
import { useUser } from '@/_state/user'
import ReportError from '@/views/practice/ReportError'

const TEST_TYPE = 'self'

export default ({ word, next }) => {
  const { user } = useUser()
  const [answerIsShown, setAnswerIsShown] = useState(false)
  const [ isReportingError, setIsReportingError ] = useState()

  const saveAnswer = async correct => {
    next()
    try {
      const newData = {
        type: TEST_TYPE,
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

  return <Card>
    <p>Translate from English to Italian...</p>
    <h2>{word?.translation_en}</h2>
    <p>(Think of the answer and hit the button when you're ready)</p>
    {
      !answerIsShown ?
      <button onClick={() => setAnswerIsShown(true)}>Show answer</button> :
      <>
        <h4>{word?.name}</h4>
        <Link to={`/words/${word?.id}`}>go to word</Link>
        <br />
        <button onClick={() => saveAnswer(true)}>I was right</button>
        <button onClick={() => saveAnswer(false)}>I was wrong</button>
        <br />
        <br />
        <button onClick={() => setIsReportingError(true)}>Report translation error</button>
        { isReportingError && <ReportError word={word} close={() => setIsReportingError(false)} /> }
      </>
    }
  </Card>
}
