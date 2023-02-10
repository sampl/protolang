import { useSelect, useFilter } from 'react-supabase'
import { useState } from 'react'

import { useLanguage } from '@/_state/language'
import Card from '@/views/practice/Card'
import { TwoColumns } from '@/styles/Layout'
import { useUser } from '@/_state/user'
import AttemptsList from './AttemptsList'

export default () => {
  const { currentLanguage } = useLanguage()
  const { user } = useUser()

  const [{ data: lessons, lessonsError, lessonsFetching }] = useSelect('lessons', {
    filter: useFilter(
      (query) => query.eq('language', currentLanguage.id),
      [currentLanguage.id],
    ),
  })

  const [{ data: phrases, phrasesError, phrasesFetching }] = useSelect('phrases', {
    filter: useFilter(
      (query) => query.eq('language', currentLanguage.id),
      [currentLanguage.id],
    )
  })

  const [phraseSource, setPhraseSource] = useState('')
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0)
  const [cardType, setCardType] = useState('speech')
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
        phrasesFetching ? 'loading...' :
        (!phrases || phrases.length <= 0) ? 'no phrases' :
        <Card
          key={currentPhraseIndex}
          phrase={phrases[currentPhraseIndex]}
          type={cardType}
          direction={direction}
          next={nextPhrase}
        />
      }

      <br />

      <AttemptsList />
    </div>

    <div>
      <select value={phraseSource} onChange={e => setPhraseSource(e.target.value)}>
        <optgroup label="Lessons">
          {
            !lessonsError &&
            !lessonsFetching &&
            lessons?.map(lesson => <option key={lesson.id} value={lesson.id}>{lesson.title_en}</option>)
          }
        </optgroup>
      </select>
      <br />
      <select value={cardType} onChange={e => setCardType(e.target.value)}>
        <option value="text">Text</option>
        <option value="speech">Speech</option>
      </select>
      <br />
      <select value={direction} onChange={e => setDirection(e.target.value)}>
        <option value="forward">English to Italian</option>
        <option value="reverse">Italian to English</option>
      </select>
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
