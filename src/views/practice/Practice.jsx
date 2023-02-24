import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

import { supabase, useSupabaseQuery } from '@/db/supabase'
import CardDeck from '@/views/practice/CardDeck'
import { TwoColumns } from '@/styles/Layout'
import DailyProgress from './DailyProgress'
import AnswerPhrase from './AnswerPhrase'

export default () => {
  const { langId } = useParams()

  const [phraseSource, setPhraseSource] = useState('')
  const [phraseList, setPhraseList] = useState(null)
  const [cardQuestionType, setCardQuestionType] = useState('both')
  const [cardAnswerType, setCardAnswerType] = useState('speech')
  const [direction, setDirection] = useState('forward')
  const [phraseToShowInfoAbout, setPhraseToShowInfoAbout] = useState(null)

  const lessonsQuery = supabase
    .from('lessons')
    .select('*')
    // .select('*, phrase_ids(*)') // someday
    .eq('language_id', langId)
  const [lessons, lessonsLoading, lessonsError] = useSupabaseQuery(lessonsQuery, [langId])

  const phrasesQuery = supabase
    .from('phrases')
    .select()
    .eq('language_id', langId)
    .limit(50)
  const [phrases, phrasesLoading, phrasesError] = useSupabaseQuery(phrasesQuery, [langId], !langId)
  
  // const lessonToUse = phraseSource === 'all' ? [] : 
  //                     !lessons ? [] :
  //                     lessons.find(l => l.id === phraseSource)

  // const lessonPhrasesQuery = supabase
  //   .from('phrases')
  //   .select()
  //   .eq('content', lessonToUse?.phrase_strings_it) // TODO
  // const [lessonPhrases, lessonPhrasesLoading, lessonPhrasesError] = useSupabaseQuery(lessonPhrasesQuery, [lessonToUse?.phrase_strings_it], !lessonToUse?.phrase_strings_it)
  
  // // will only pull from the phrases with it="foo"
  // const phrasesToUse = phraseSource === 'all' ? phrases : lessonPhrases
  // console.log(phrasesToUse)

  // shuffle the deck once and only once per load
  useEffect(() => {
    if (phraseList || !phrases) return
    shuffleArray(phrases)
    setPhraseList([...phrases])
  }, [phrases])

  return <TwoColumns cols="2fr 1fr">
    <div>
      <CardDeck
        cardQuestionType={cardQuestionType}
        cardAnswerType={cardAnswerType}
        direction={direction}
        phrases={phraseList}
        phrasesLoading={phrasesLoading}
        phrasesError={phrasesError}
        setPhraseToShowInfoAbout={setPhraseToShowInfoAbout}
      />

      {/* TODO - maybe refactor this out so we're not getting it from some buried component */}
      { phraseToShowInfoAbout ? <AnswerPhrase phrase={phraseToShowInfoAbout} /> : '' }

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
      <hr />
      <Link to={`/${langId}/practice/history`}>Practice history</Link>
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
