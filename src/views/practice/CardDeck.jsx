import { useEffect, useState } from 'react'

import Card from '@/views/practice/Card'

export default ({ cardQuestionType, cardAnswerType, direction, phrases, phrasesLoading, phrasesError, setPhraseToShowInfoAbout }) => {

  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0)

  const nextPhrase = () => {
    setPhraseToShowInfoAbout(null)
    setCurrentPhraseIndex(current => {
      if (phrases.length - 1 <= current) {
        return 0
      } else {
        return current + 1
      }
    })
  }

  if (phrasesError) return <div>error: {error.message}</div>
  if (phrasesLoading) return <div>loading...</div>
  if (!phrases || phrases.length <= 0) return <div>no phrases (try refreshing)</div>

  return <div style={{position: 'relative', height: '240px', borderBottom: '1px solid'}}>
    {phrases.map( (phrase, index) => {
      return <Card
        key={phrase.id}
        phrase={phrase}
        isUpcoming={index > currentPhraseIndex}
        placeInLine={index - currentPhraseIndex}
        isCurrent={index === currentPhraseIndex}
        isDone={index < currentPhraseIndex}
        cardQuestionType={cardQuestionType}
        cardAnswerType={cardAnswerType}
        direction={direction}
        next={nextPhrase}
        setPhraseToShowInfoAbout={setPhraseToShowInfoAbout}
      />
    })}
  </div>
}
