// import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import styled from 'styled-components/macro'

import SpeakWord from '../dictionary/SpeakWord'
import MnemonicSuggested from '@/views/mnemonics/MnemonicSuggested'
import { supabaseDictionaries, useSupabaseQuery } from '@/db/supabase'
import Pronouncable from '../dictionary/Pronouncable'

// TODO
// play pronunciation of each syllable
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
    <MnemonicSuggested wordString={wordString} />

    {
      error ? <div>Error getting definitions: {error.message}</div> :
      loading ? <div>...</div> :
      (!definitions || definitions.length === 0) ? <div>(Not in our dictionary yet)</div> :
      <>
        <ul>
          {definitions.map(word => {
            const sounds = word._wiktionary_data?.sounds
            const ipaSounds = sounds?.filter(sound => sound.ipa)
            const ipa = ipaSounds?.length > 0 ? ipaSounds[0].ipa : null
            const rhymeSounds = sounds?.filter(sound => sound.rhyme)
            const rhyme = rhymeSounds?.length > 0 ? rhymeSounds[0].rhyme : null
            return <li key={word.id}>
              {ipa && <Pronouncable ipa={ipa} />}
              {' '}
              {word._wiktionary_data?.senses[0].glosses.join('\n')}
              {rhyme && <div>rhyme: {rhyme}</div>}
            </li>
          })}
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
