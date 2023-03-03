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

const MAX_TRANSLATION_STRIKES = 1
const MAX_PRONUNCIATION_STRIKES = 3

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
  practiceType,
  lessonEmbed,
}) => {
  const { user } = useUser()
  const { currentLanguage } = useLanguage()

  // waiting, try_again, correct, incorrect
  const [cardState, setCardState] = useState('waiting')
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0)
  const [recentAnswer, setRecentAnswer] = useState(null)
  const [strikes, setStrikes] = useState(0)

  const phrase = phrases && phrases[currentPhraseIndex]
  const singleCardMode = phrases && phrases.length === 1

  const nextPhrase = () => {
    setStrikes(0)
    setCardState('waiting')
    setRecentAnswer(null)
    if (singleCardMode) return
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
    const maxStrikes = practiceType === 'translation' ? MAX_TRANSLATION_STRIKES : MAX_PRONUNCIATION_STRIKES
    if (!correct && strikes < maxStrikes) {
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
        prompt_type: cardQuestionType,
        repeated_only: practiceType === 'pronunciation',
        guess: answer.trim(),
        is_correct: correct,
        answer_type: practiceType === 'translation' ? cardAnswerType : 'speech',
        // perfect_answer, // TODO - return in test algo
        // with_hint, // TODO - detect hints
        second_try: strikes > 0,
        created_by: user.id,
      }
      if (practiceType === 'translation') {
        newData.direction = direction
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

  let question, correctAnswer
  if (practiceType === 'translation') {
    question =      direction === 'forward' ? phrase.content_eng : phrase.content_ita
    correctAnswer = direction === 'forward' ? phrase.content_ita : phrase.content_eng
  } else if (practiceType === 'pronunciation') {
    question = phrase.content_ita
    correctAnswer = phrase.content_ita
  }
  const CardAnswerComponent = cardAnswerType === 'text' ? CardAnswerText : CardAnswerSpeech

  return <>
    <div style={{position: 'relative', height: !lessonEmbed && '240px', margin: !lessonEmbed && '0 0 2rem'}}>
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
          practiceType={practiceType}
          lessonEmbed={lessonEmbed}
        />
      })}
    </div>

    {/*
      TODO
        - let people record a pronunciation practice right from the lesson
        - show whether a phrase is in their library, ie
        - phraseScore && phraseScore.num_correct > 0) ? '✅' : '❌'
    */}
    { !lessonEmbed && 
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
    }

    {
      (cardState === "correct" || cardState === "incorrect") &&
      !singleCardMode && 
      <button className="button" autoFocus onClick={nextPhrase} style={{fontSize: '20px', width: '100%'}}>Next</button>
    }
    {
      cardState === "try_again" ? <>
        Not quite, try again...
      </>
      :
      cardState === "correct" ? <>
        You're right!
      </>
      :
      cardState === "incorrect" ? <>
        {practiceType === 'translation' ?
          <>
            Whoops, not quite. The answer is "{correctAnswer}"
            <DiffSentences correctAnswer={correctAnswer} guess={recentAnswer} />
          </> :
          <>
            That's not quite it. Let's skip this one for now.
          </>
        }
      </>
      :
      null
    }
    {
      (cardState === "waiting" || cardState === "try_again") && !singleCardMode && 
      <button onClick={nextPhrase} style={{padding: '1rem', textAlign: 'center', width: '100%'}}>skip</button>
    }
  </>
}
