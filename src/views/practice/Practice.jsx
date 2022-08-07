import { useSelect, useFilter } from 'react-supabase'
import { useState } from 'react'

import { useLanguage } from '@/_state/language'
import Card from '@/views/practice/Card'
import { TwoColumns } from '@/styles/Layout'

export default () => {
  const { currentLanguage } = useLanguage()

  const [{ data: words, error, fetching }] = useSelect('words', {
    filter: useFilter(
      (query) => query.eq('language', currentLanguage.id),
      [currentLanguage.id],
    )
  })

  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [cardType, setCardType] = useState('speech')
  const [direction, setDirection] = useState('reverse')

  words && shuffleArray(words)

  const nextWord = () => {
    if (words.length - 1 <= currentWordIndex) {
      setCurrentWordIndex(0)
    } else {
      setCurrentWordIndex(currentWordIndex + 1)
    }
  }

  return <TwoColumns cols="2fr 1fr">
    {
      error ? error.message :
      fetching ? 'loading...' :
      (!words || words.length <= 0) ? 'no words' :
      <Card
      key={currentWordIndex}
      word={words[currentWordIndex]}
      type={cardType}
      direction={direction}
      next={nextWord}
      />
    }
    <div>
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
