import { useFilter, useSelect } from 'react-supabase'
import { useParams } from 'react-router-dom'

import CardList from '@/practice/CardList'
import Layout from '@/_layout/Layout'

export default () => {
  let { id } = useParams()

  const filter = useFilter(
    (query) => query.eq('id', id),
    [id],
  )

  const [{ data, error, fetching }] = useSelect('decks', { filter })

  const deck = data && data[0]

  return <Layout>
    {error && error.message}
    {fetching && 'loading...'}
    { deck &&
      <>
        <h1>{deck && deck.title_en}</h1>
        <CardList deckId={deck.id} />
      </>
    }
  </Layout>
}
