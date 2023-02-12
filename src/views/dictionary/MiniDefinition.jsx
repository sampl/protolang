import { Link } from 'react-router-dom'
import { supabaseDictionaries, useSupabaseQuery } from '@/db/supabase'

import MnemonicSuggested from './MnemonicSuggested'
import SpeakWord from './SpeakWord'
// import PhraseScore from './PhraseScore'
import { useLanguage } from '@/_state/language'

export default ({ name }) => {

  const { currentLanguage } = useLanguage()

  let query = supabaseDictionaries
    .from(currentLanguage.id)
    .select()
    .eq('word', name)
    .single()
  const [word, loading, error] = useSupabaseQuery(query)

  return <>
    {
      error ? error.message :
      loading ? 'loading...' :
      !word ? <>
        <p>Sorry, this word isn't in our dictionary yet</p>
        <Link to="/contact">Contact us to request it</Link>
      </>
      :
      <>
        <strong>{word.word}</strong>
        <SpeakWord wordString={word?.word} />
        <br />
        <Link to={`/${currentLanguage.id}/dictionary/${word.word}`}>view full definition</Link>

        <div>{word._wiktionary_data?.senses[0].glosses.join(', ')}</div>

        <MnemonicSuggested string={word?.word} />

        {/* <p>
          You have
          {' '}
          <PhraseScore word={word} />
          {' '}
          accuracy on this word
        </p> */}
      </>
    }
  </>
}
