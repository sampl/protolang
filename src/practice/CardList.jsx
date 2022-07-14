import { useFilter, useSelect } from 'react-supabase'
import { useState } from 'react'

import Card from '@/practice/Card'

export default ({ deckId }) => {

  const filter = useFilter(
    (query) => query.eq('deck', deckId),
    [deckId],
  )

  const [{ data: cards, error, fetching }] = useSelect('deck_items', {
    columns: '*, word(*)',
    filter,
  })

  const [currentCardIndex, setCurrentCardIndex] = useState(0)

  const nextCard = () => {
    if (cards.length - 1 <= currentCardIndex) {
      setCurrentCardIndex(0)
    } else {
      setCurrentCardIndex(currentCardIndex + 1)
    }
  }

  return <div>
    {
      error ? error.message :
      fetching ? 'loading...' :
      (!cards || cards.length <= 0) ? 'no cards' :
      <Card
        key={currentCardIndex}
        card={cards[currentCardIndex]}
        nextCard={nextCard}
      />
    }
  </div>
}