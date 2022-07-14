import { useSelect, useFilter } from 'react-supabase'
import { Link } from 'react-router-dom'

import { useLanguage } from '@/_state/language'

export default () => {

  const { currentLanguageId } = useLanguage()

  const filter = useFilter(
    (query) => query.eq('language', currentLanguageId),
    [currentLanguageId],
  )

  const [{ data: decks, error, fetching }] = useSelect('decks', { filter })

  return <>
    <h1>Practice</h1>

    <h2>Decks</h2>

    {
      error ? error.message :
      fetching ? 'loading...' :
      (!decks || decks.length <= 0) ? 'no decks' :
      decks.map(deck => <DeckListItem key={deck.id} deck={deck} />)
    }
  </>
}

const DeckListItem = ({deck}) => {
  return <>
    <Link to={`/practice/deck/${deck.id}`}>
      {deck.title_en}
    </Link>
    <br />
  </>
}
