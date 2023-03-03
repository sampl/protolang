import { useState } from 'react'
// import { Link } from 'react-router-dom'

import { supabase } from '@/db/supabase'
import { useUser } from '@/_state/user'
import CardAnswerText from './card_answer_types/CardAnswerText'
import CardAnswerSpeech from './card_answer_types/CardAnswerSpeech'
import { useLanguage } from '@/_state/language'
import { logError } from '../../_util/error.js'

import Card from '@/views/practice/Card'
import DiffSentences from '@/views/practice/DiffSentences'

const MAX_STRIKES = 1

// https://stackoverflow.com/a/37511463/1061063
const normalizeString = string => string.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase()

export default ({
  cardQuestionType,
  cardAnswerType,
  direction,
  phrases,
  phrasesLoading,
  phrasesError,
  setPhraseToShowInfoAbout,
}) => {
  const { user } = useUser()
  const { currentLanguage } = useLanguage()

  // waiting, try_again, correct, incorrect
  const [cardState, setCardState] = useState('waiting')
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0)
  const [recentAnswer, setRecentAnswer] = useState(null)
  const [strikes, setStrikes] = useState(0)

  const phrase = phrases && phrases[currentPhraseIndex]

  const nextPhrase = () => {
    setStrikes(0)
    setCardState('waiting')
    setRecentAnswer(null)
    setPhraseToShowInfoAbout(null)
    setCurrentPhraseIndex(current => {
      if (phrases.length - 1 <= current) {
        return 0
      } else {
        return current + 1
      }
    })
  }
  
  const testAnswer = answer => {
    return normalizeString(correctAnswer) === normalizeString(answer)
  }

  const testPartialAnswer = answer => {
    return normalizeString(correctAnswer).startsWith(normalizeString(answer))
  }

  const submitAnswer = async answer => {
    console.log('SUBMITTING ANSWER', answer)
    setRecentAnswer(answer.trim())
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
      logError('save your guess', error)
    }
  }

  if (phrasesError) return <div>error: {error.message}</div>
  if (phrasesLoading) return <div>loading...</div>
  if (!phrases || phrases.length <= 0) return <div>no phrases (try refreshing)</div>

  const question =      direction === 'forward' ? phrase.content_eng : phrase.content_ita
  const correctAnswer = direction === 'forward' ? phrase.content_ita : phrase.content_eng
  const CardAnswerComponent = cardAnswerType === 'text' ? CardAnswerText : CardAnswerSpeech

  // console.log('correctAnswer', correctAnswer)

  return <>
    <div style={{position: 'relative', height: '240px', margin: '0 0 2rem'}}>
      {phrases.map( (phrase, index) => {
        return <Card
          key={phrase.id}
          phrase={phrase}
          placeInLine={index - currentPhraseIndex}
          isCurrent={index === currentPhraseIndex}
          isRecentlyDone={currentPhraseIndex - index === 1}
          isDone={index < currentPhraseIndex}
          cardQuestionType={cardQuestionType}
          cardAnswerType={cardAnswerType}
          direction={direction}
          next={nextPhrase}
          question={question}
        />
      })}
    </div>

    <CardAnswerComponent
      id={phrase?.id}
      direction={direction}
      question={question}
      correctAnswer={correctAnswer}
      disabled={cardState === 'correct' || cardState === 'incorrect'}
      testAnswer={testAnswer}
      testPartialAnswer={testPartialAnswer}
      submitAnswer={submitAnswer}
    />

    <br />

    {
      cardState === "try_again" ? <>
        Not quite, try again...
      </>
      :
      cardState === "correct" ? <>
        <button className="button" autoFocus onClick={nextPhrase} style={{fontSize: '20px', width: '100%'}}>Next</button>
        You're right!
      </>
      :
      cardState === "incorrect" ? <>
        <button className="button" autoFocus onClick={nextPhrase} style={{fontSize: '20px', width: '100%'}}>Next</button>
        Whoops not quite. The answer is "{correctAnswer}"
        <DiffSentences correctAnswer={correctAnswer} guess={recentAnswer} />
      </>
      :
      null
    }
    {
      (cardState === "waiting" || cardState === "try_again") && 
      <button onClick={nextPhrase} style={{padding: '1rem', textAlign: 'center', width: '100%'}}>skip</button>
    }
  </>
}
