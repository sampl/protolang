import styled from 'styled-components/macro'
import { useDebounce } from 'use-debounce'
import {useParams, Link} from 'react-router-dom'

import { supabase, useSupabaseQuery } from '@/db/supabase'
import MnemonicSuggested from '@/views/mnemonics/MnemonicSuggested'
import SpeakWord from '../dictionary/SpeakWord'
import Definable from './Definable'
import PhraseNew from '../practice/PhraseNew'
import { useUser } from '@/_state/user'
import PhraseEdit from '../practice/PhraseEdit'

export default ({ it: initialIt, en: initialEn }) => {

  const { langId } = useParams()
  const { isAdmin } = useUser()

  const [en] = useDebounce(initialEn, 500, { leading: true })
  const [it] = useDebounce(initialIt, 500, { leading: true })

  // https://supabase.com/docs/reference/javascript/or
  const query = supabase
    .from('phrases')
    .select()
    .or(`content_ita.eq.${it},content_eng.eq.${en}`)
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
  if (!phrase.content_ita) return <LessonEmbedWrapper>Missing Italian translation for this phrase</LessonEmbedWrapper>
  if (!phrase.content_eng) return <LessonEmbedWrapper>Missing English translation for this phrase</LessonEmbedWrapper>

  return <LessonEmbedWrapper>
    <div>
      <strong><Definable wordString={phrase.content_ita} /></strong>
      <SpeakWord wordString={phrase.content_ita} />
    </div>
    <div style={{fontSize: 'small'}}>
      {phrase.content_ita_alts && phrase.content_ita_alts.length > 0 && 'or '}
      {phrase.content_ita_alts?.join(', ') || ""}
    </div>
    <p>{phrase.content_eng}</p>
    <div style={{fontSize: 'small'}}>
      {phrase.content_eng_alts && phrase.content_eng_alts.length > 0 && 'or '}
      {phrase.content_eng_alts?.join(', ') || ""}
    </div>
    <MnemonicSuggested string={phrase.content_ita} />
    {isAdmin && <PhraseEdit phrase={phrase} />}
  </LessonEmbedWrapper>
}

export const LessonEmbedWrapper = styled.div`
  display: block;
  border: 1px solid;
  padding: .5rem;
  margin: 0 0 -1px 0;
`
