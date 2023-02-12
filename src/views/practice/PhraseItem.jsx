import { useParams } from 'react-router-dom'

import { supabase, useSupabaseQuery } from '@/db/supabase'
import { BreadcrumbItem, BreadcrumbSeparator, BreadcrumbWrapper } from '@/styles/Breadcrumbs'
// import AttemptsList from './AttemptsList'
import SpeakWord from '../dictionary/SpeakWord'

import PhraseScore from './PhraseScore'
import Definable from '../lessons/Definable'

export default () => {
  const { langId, phraseId } = useParams()
  // const phraseIdDecoded = decodeURIComponent(phraseId)

  let query = supabase
    .from('phrases')
    .select()
    .eq('id', phraseId)
    .single()
  const [phrase, loading, error] = useSupabaseQuery(query, [phraseId])

  return <>
    <BreadcrumbWrapper>
      <BreadcrumbItem to={`/${langId}/practice`}>Practice</BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem to={`/${langId}/practice/${phrase?.id}`}>{phrase?.name}</BreadcrumbItem>
    </BreadcrumbWrapper>

    {
      error ? error.message :
      loading ? 'loading...' :
      !phrase ? 'Phrase not found' :
      <>
        <h1>
          <Definable wordString={phrase.name} />
          <SpeakWord wordString={phrase.name} />
        </h1>

        <div>{phrase.translation_en}</div>
        <div>{phrase.context_en}</div>

        <hr />

        {/* TODO - attempts list here */}
        <h3>
          Your accuracy:
          {' '}
          <PhraseScore phrase={phrase} />
        </h3>
      </>
    }
  </>
}
