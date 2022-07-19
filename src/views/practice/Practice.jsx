import { useSelect, useFilter } from 'react-supabase'
import { useState } from 'react'

import { useLanguage } from '@/_state/language'
import Card from '@/views/practice/Card'

export default () => {
  const { currentLanguageId } = useLanguage()
  const filter = useFilter(
    (query) => query.eq('language', currentLanguageId),
    [currentLanguageId],
  )
  const [{ data: words, error, fetching }] = useSelect('words', { filter })
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [cardType, setCardType] = useState('speech')

  words && shuffleArray(words)

  const nextWord = () => {
    if (words.length - 1 <= currentWordIndex) {
      setCurrentWordIndex(0)
    } else {
      setCurrentWordIndex(currentWordIndex + 1)
    }
  }

  return <>
    <select value={cardType} onChange={e => setCardType(e.value)}>
      <option value="text">Text</option>
      <option value="speech">Speech</option>
    </select>
    {
      error ? error.message :
      fetching ? 'loading...' :
      (!words || words.length <= 0) ? 'no words' :
      <Card
        key={currentWordIndex}
        word={words[currentWordIndex]}
        type={cardType}
        next={nextWord}
      />
    }
  </>
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
