import { useFilter, useSelect } from 'react-supabase'

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

  return <div>
    {error && error.message}
    {fetching && 'loading...'}
    {
      (!cards || cards.length <= 0)
      ?
      'no cards'
      :
      cards.map(card => <Card key={card.id} card={card} />)
    }
  </div>
}