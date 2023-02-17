import { supabase, useSupabaseQuery } from '@/db/supabase'
import styled from 'styled-components/macro'
import MnemonicSuggested from '@/views/mnemonics/MnemonicSuggested'

import SpeakWord from '../dictionary/SpeakWord'
import Definable from './Definable'

export default ({ it, en }) => {

  // https://supabase.com/docs/reference/javascript/or
  const query = supabase
    .from('phrases')
    .select()
    .or(`it.eq.${it},en.eq.${en}`)
    .single()
  const [phrase, loading, error] = useSupabaseQuery(query, [en, it], !(en || it))

  // TODO - mnemonics

  if (loading) return <span>Loading...</span>
  if (error) return <span>Error: {error.message}</span>
  if (!it) return <LessonEmbedWrapper>Missing Italian translation for this phrase</LessonEmbedWrapper>
  if (!en) return <LessonEmbedWrapper>Missing English translation for this phrase</LessonEmbedWrapper>

  return <LessonEmbedWrapper>
    <div>
      <Definable wordString={phrase.content_it} />
      <SpeakWord wordString={phrase.content_it} />
    </div>
    <p>{phrase.content_en}</p>
    {phrase.en_alts?.map((alt, i) => <p key={i}>{alt}</p> || "")}
    <MnemonicSuggested string={phrase.content_it} />
  </LessonEmbedWrapper>
}

export const LessonEmbedWrapper = styled.div`
  display: block;
  border: 1px solid;
  padding: .5rem;
  margin: 0 0 -1px 0;
`
