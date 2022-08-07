import { useFilter, useSelect } from 'react-supabase'

import MnemonicSuggested from './MnemonicSuggested'
import SpeakWord from './SpeakWord'
import WordScore from './WordScore'

export default ({ wordString }) => {

  const [{ data, error, fetching }] = useSelect('words', {
    filter: useFilter(
      (query) => query.eq('name', wordString),
      [wordString],
    ),
  })

  const word = data && data[0]

  return <>
    {
      error ? error.message :
      fetching ? 'loading...' :
      !word ? `Sorry, this word isn't in our dictionary yet` :
      <>
        <h1>{word?.name}</h1>
        <SpeakWord word={word} />

        <div>({word?.type})</div>
        <div>{word?.translation_en}</div>
        <div>{word?.context_en}</div>

        <MnemonicSuggested word={word} />

        <p>
          You have
          {' '}
          <WordScore word={word} />
          {' '}
          accuracy on this word
        </p>
      </>
    }
  </>
}
