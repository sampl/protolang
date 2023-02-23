import styled from 'styled-components/macro'
import { useDebounce } from 'use-debounce'
import {useParams, Link} from 'react-router-dom'

import { supabase, useSupabaseQuery } from '@/db/supabase'
import MnemonicSuggested from '@/views/mnemonics/MnemonicSuggested'
import SpeakWord from '../dictionary/SpeakWord'
import Definable from './Definable'
import PhraseNew from '../practice/PhraseNew'
import { useUser } from '@/_state/user'

export default ({ it: initialIt, en: initialEn }) => {

  const { langId } = useParams()
  const { isAdmin } = useUser()

  const [en] = useDebounce(initialEn, 500, { leading: true })
  const [it] = useDebounce(initialIt, 500, { leading: true })

  // https://supabase.com/docs/reference/javascript/or
  const query = supabase
    .from('phrases')
    .select()
    .or(`content_it.eq.${it},content_en.eq.${en}`)
    .single()
  const [phrase, loading, error] = useSupabaseQuery(query, [en, it], !(en || it))

  if (loading) return <LessonEmbedWrapper>Loading...</LessonEmbedWrapper>
  if (error && error.code === "PGRST116") return <LessonEmbedWrapper>
    ⚠️ No phrase found for "{it}" or "{en}"
    <br />
    <PhraseNew it={it} en={en} />
  </LessonEmbedWrapper>
  if (error) return <LessonEmbedWrapper>
    ❌ Sorry, something went wrong on our end
    <br />
    <code style={{display: 'block'}}>
      Error: {error.message}
    </code>
  </LessonEmbedWrapper>
  if (!phrase.content_it) return <LessonEmbedWrapper>Missing Italian translation for this phrase</LessonEmbedWrapper>
  if (!phrase.content_en) return <LessonEmbedWrapper>Missing English translation for this phrase</LessonEmbedWrapper>

  return <LessonEmbedWrapper>
    {isAdmin && <Link to={`/${langId}/practice/${phrase.id}/edit`} style={{float: 'right'}}>edit</Link>}
    <div>
      <Definable wordString={phrase.content_it} />
      <SpeakWord wordString={phrase.content_it} />
    </div>
    <div style={{fontSize: 'small'}}>
      {phrase.it_alts && phrase.it_alts.length > 0 && 'or '}
      {phrase.it_alts?.join(', ') || ""}
    </div>
    <p>{phrase.content_en}</p>
    <div style={{fontSize: 'small'}}>
      {phrase.en_alts && phrase.en_alts.length > 0 && 'or '}
      {phrase.en_alts?.join(', ') || ""}
    </div>
    <MnemonicSuggested string={phrase.content_it} />
  </LessonEmbedWrapper>
}

export const LessonEmbedWrapper = styled.div`
  display: block;
  border: 1px solid;
  padding: .5rem;
  margin: 0 0 -1px 0;
`
