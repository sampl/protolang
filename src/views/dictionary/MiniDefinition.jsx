import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabaseDictionaries } from '@/db/supabase'

import MnemonicSuggested from './MnemonicSuggested'
import SpeakWord from './SpeakWord'
// import PhraseScore from './PhraseScore'
import { useLanguage } from '@/_state/language'

export default ({ name }) => {

  const { currentLanguage } = useLanguage()

  const [fetching, setFetching] = useState(true)
  const [data, setData] = useState()
  const [error, setError] = useState()

  useEffect(() => {
    const doThing = async () => {
      const { data, error } = await supabaseDictionaries
      .from(currentLanguage.id)
      .select()
      .eq('word', name)
      setFetching(false)
      setData(data)
      setError(error)
    }
    doThing()
  }, [])

  const word = data && data[0]

  // debugger

  return <>
    {
      error ? error.message :
      fetching ? 'loading...' :
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
