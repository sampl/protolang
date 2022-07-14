import { useState } from 'react'
import { Link } from 'react-router-dom'

import Card from '@/styles/Card'

export default ({ card, nextCard }) => {
  const [answerIsShown, setAnswerIsShown] = useState(false)

  return <Card>
    <h2>{card?.word.translation_en}</h2>
    {
    !answerIsShown
    ?
    <button onClick={() => setAnswerIsShown(true)}>Reveal</button>
    :
    <>
      <h4>{card?.word.name}</h4>
      <Link to={`/words/${card.word.id}`}>go to word</Link>
      <br />
      <button onClick={nextCard}>Next</button>
    </>
    }
  </Card>
}
