// import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import styled from 'styled-components/macro'

import SpeakWord from '../dictionary/SpeakWord'
import MnemonicSuggested from '@/views/mnemonics/MnemonicSuggested'
import { supabaseDictionaries, useSupabaseQuery } from '@/db/supabase'

// TODO
// see/play pronunciation of each syllable
// For verbs, show conjugation tables
// more mnemonics?

export default ({ wordString }) => {
  const { langId } = useParams()

  const query = supabaseDictionaries
    .from(langId)
    .select()
    .eq('word', wordString)
  const [definitions, loading, error] = useSupabaseQuery(query, [wordString], !wordString)

  return <WordWrapper>
    <strong>{wordString}</strong>
    <SpeakWord wordString={wordString} />
    <MnemonicSuggested string={wordString} />

    {
      error ? <div>Error getting definitions: {error.message}</div> :
      loading ? <div>...</div> :
      (!definitions || definitions.length === 0) ? <div>(Not in our dictionary yet)</div> :
      <>
        <ul>
          {definitions.map(word => <li>
            {word._wiktionary_data?.senses[0].glosses.join('\n')}
          </li>)}
        </ul>
        <Link to={`/${langId}/dictionary/${wordString}`}>{definitions.length !== 1 ? 'all definitions' : 'full definition'}</Link>
      </>
    }

  </WordWrapper>
}

export const WordWrapper = styled.div`
  border-top: 1px solid;
  padding: .5rem 0;
  /* background: white; */
`
