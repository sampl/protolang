import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'

import { supabase, useSupabaseQuery } from '@/db/supabase'
import Card from '@/views/practice/Card'
import { TwoColumns } from '@/styles/Layout'
import AttemptsList from './AttemptsList'
import DailyProgress from './DailyProgress'
import { useUser } from '@/_state/user'

export default () => {
  const { langId } = useParams()
  const { isAdmin } = useUser()

  const lessonsQuery = supabase
    .from('lessons')
    .select()
    .eq('language_id', langId)
  const [lessons, lessonsLoading, lessonsError] = useSupabaseQuery(lessonsQuery, [langId])

  const phrasesQuery = supabase
    .from('phrases')
    .select()
    .eq('language_id', langId)
  const [phrases, phrasesLoading, phrasesError] = useSupabaseQuery(phrasesQuery, [langId])

  const [phraseSource, setPhraseSource] = useState('')
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0)
  const [cardQuestionType, setCardQuestionType] = useState('both')
  const [cardAnswerType, setCardAnswerType] = useState('speech')
  const [direction, setDirection] = useState('reverse')

  phrases && shuffleArray(phrases)

  const nextPhrase = () => {
    if (phrases.length - 1 <= currentPhraseIndex) {
      setCurrentPhraseIndex(0)
    } else {
      setCurrentPhraseIndex(currentPhraseIndex + 1)
    }
  }

  return <TwoColumns cols="2fr 1fr">
    <div>
      {
        phrasesError ? phrasesError.message :
        phrasesLoading ? 'loading...' :
        (!phrases || phrases.length <= 0) ? 'no phrases' :
        <Card
          key={currentPhraseIndex}
          phrase={phrases[currentPhraseIndex]}
          cardQuestionType={cardQuestionType}
          cardAnswerType={cardAnswerType}
          direction={direction}
          next={nextPhrase}
        />
      }

      <br />

      <AttemptsList />
    </div>

    <div>
      <DailyProgress />
      <hr />
      pull words from:
      <select value={phraseSource} onChange={e => setPhraseSource(e.target.value)} disabled>
        <option value="all">All phrases</option>
        <optgroup label="Lessons">
          {
            !lessonsError &&
            !lessonsLoading &&
            lessons?.map(lesson => <option key={lesson.id} value={lesson.id}>{lesson.title_en}</option>)
          }
        </optgroup>
      </select>
      <br />
      direction:
      <select value={direction} onChange={e => setDirection(e.target.value)}>
        <option value="forward">English to Italian</option>
        <option value="reverse">Italian to English</option>
      </select>
      <br />
      question type:
      <select value={cardQuestionType} onChange={e => setCardQuestionType(e.target.value)}>
        <option value="both">Text and audio</option>
        <option value="text">Text only</option>
        <option value="audio">Audio only</option>
      </select>
      <br />
      answer type:
      <select value={cardAnswerType} onChange={e => setCardAnswerType(e.target.value)}>
        <option value="text">Text</option>
        <option value="speech">Speech</option>
      </select>
      { isAdmin && <div>
          <hr />
          <Link to={`/${langId}/practice/new`}>New phrase</Link>
        </div>
      }
    </div>
  </TwoColumns>
}

// https://stackoverflow.com/a/2450976/1061063
function shuffleArray(array) {
  let currentIndex = array.length, randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}
