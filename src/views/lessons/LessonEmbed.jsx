import styled from 'styled-components/macro'
import { useDebounce } from 'use-debounce'

import { supabase, useSupabaseQuery } from '@/db/supabase'
import PhraseNew from '../practice/PhraseNew'
// import { useUser } from '@/_state/user'
import CardDeck from '../practice/CardDeck'

export default ({ ita: initialIta, eng: initialEng }) => {

  // const { user } = useUser()

  const [word_eng] = useDebounce(initialEng, 500, { leading: true })
  const [word_ita] = useDebounce(initialIta, 500, { leading: true })

  // https://supabase.com/docs/reference/javascript/or
  const phraseQuery = supabase
    .from('phrases')
    .select()
    .or(`content_ita.eq.${word_ita},content_eng.eq.${word_eng}`)
    .single()
  const [phrase, phraseLoading, phraseError] = useSupabaseQuery(phraseQuery, [word_eng, word_ita], !(word_eng || word_ita))

  // const phraseScoreQuery = supabase
  //   .from('user_phrase_scores')
  //   .select()
  //   .eq('phrase', phrase?.id)
  //   .eq('created_by', user?.id)
  //   .single()
  // const [phraseScore, phraseScoreLoading, phraseScoreError] = useSupabaseQuery(phraseScoreQuery, [phrase?.id], !phrase)

  if (phraseLoading) return <LessonEmbedErrorWrapper>Loading...</LessonEmbedErrorWrapper>
  if (phraseError && phraseError.code === "PGRST116") return <LessonEmbedErrorWrapper>
    ⚠️ No phrase found for "{word_ita}" or "{word_eng}"
    <br />
    <PhraseNew ita={word_ita} eng={word_eng} />
  </LessonEmbedErrorWrapper>
  if (phraseError) return <LessonEmbedErrorWrapper>
    ❌ Sorry, something went wrong on our end
    <br />
    <code style={{display: 'block'}}>
      Error: {phraseError.message}
    </code>
  </LessonEmbedErrorWrapper>
  if (!phrase.content_ita) return <LessonEmbedErrorWrapper>Missing Italian translation for this phrase</LessonEmbedErrorWrapper>
  if (!phrase.content_eng) return <LessonEmbedErrorWrapper>Missing English translation for this phrase</LessonEmbedErrorWrapper>

  return <div style={{margin: '1rem 0'}}>
    <CardDeck
      practiceType="pronunciation"
      cardQuestionType="both"
      cardAnswerType="speech"
      direction={null}
      phrases={[phrase]}
      phrasesLoading={phraseLoading}
      phrasesError={phraseError}
      setPhraseToShowInfoAbout={() => {}}
      lessonEmbed={true}
    />
  </div>
}

export const LessonEmbedErrorWrapper = styled.div`
  display: grid;
  grid-template-columns: auto max-content;
  border: 1px solid;
  padding: 1rem;
  margin: 1rem 0;
  box-shadow: 1px 1px;
`
