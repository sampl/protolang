import { Link } from 'react-router-dom'
import { supabaseDictionaries, useSupabaseQuery } from '@/db/supabase'
import styled from 'styled-components/macro'

import MnemonicSuggested from '@/views/mnemonics/MnemonicSuggested'
import SpeakWord from './SpeakWord'
import { useLanguage } from '@/_state/language'

export default ({ name }) => {

  const { currentLanguage } = useLanguage()

  const query = supabaseDictionaries
    .from(currentLanguage.id)
    .select()
    .eq('word', name)
  const [words, loading, error] = useSupabaseQuery(query)

  if (error) return <div>Error: {error.message}</div>
  if (loading) return <div>loading...</div>
  if (!words || words.length === 0) return <div>Sorry, this word isn't in our dictionary yet</div>

  return <MiniDefWrapper>
    {words.map(word => <div key={word?.id}>
      <strong>{word.word}</strong>
      <SpeakWord wordString={word?.word} />
      <br />
      <Link to={`/${currentLanguage.id}/dictionary/${word.word}`}>view full definition</Link>

      <div>{word._wiktionary_data?.senses[0].glosses.join(', ')}</div>

      <MnemonicSuggested wordString={word?.word} />
      <hr />
    </div>)}
  </MiniDefWrapper>
}

export const MiniDefWrapper = styled.div`
  font-size: initial;
  font-weight: initial;
`
