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

  const nextWord = () => {
    if (words.length - 1 <= currentWordIndex) {
      setCurrentWordIndex(0)
    } else {
      setCurrentWordIndex(currentWordIndex + 1)
    }
  }

  return <>
    {
      error ? error.message :
      fetching ? 'loading...' :
      (!words || words.length <= 0) ? 'no words' :
      <Card
        key={currentWordIndex}
        word={words[currentWordIndex]}
        next={nextWord}
      />
    }
  </>
}
