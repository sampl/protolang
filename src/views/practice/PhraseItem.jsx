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

  const query = supabase
    .from('phrases')
    .select()
    .eq('id', phraseId)
    .single()
  const [phrase, loading, error] = useSupabaseQuery(query, [phraseId])

  return <>
    <BreadcrumbWrapper>
      <BreadcrumbItem to={`/${langId}/practice`}>Practice</BreadcrumbItem>
      <BreadcrumbSeparator />
      {phrase?.content_it}
    </BreadcrumbWrapper>

    {
      error ? error.message :
      loading ? 'loading...' :
      !phrase ? 'Phrase not found' :
      <>
        <h1>
          <Definable wordString={phrase.content_it} />
          <SpeakWord wordString={phrase.content_it} />
        </h1>

        <div>{phrase.content_en}</div>

        <hr />

        {/* TODO - attempts list here */}
        {/* TODO - link to edit for admins */}
        <h3>
          Your accuracy:
          {' '}
          <PhraseScore phrase={phrase} />
        </h3>
      </>
    }
  </>
}
