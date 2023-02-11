import { useParams } from 'react-router-dom'
import { useFilter, useSelect } from 'react-supabase'
import { Link } from 'react-router-dom'

import { BreadcrumbItem, BreadcrumbSeparator, BreadcrumbWrapper } from '@/styles/Breadcrumbs'
// import AttemptsList from './AttemptsList'
import SpeakWord from '../dictionary/SpeakWord'

import { useLanguage } from '@/_state/language'
import PhraseScore from './PhraseScore'
import Definable from '../lessons/Definable'

export default () => {
  const { phraseId } = useParams()
  // const phraseIdDecoded = decodeURIComponent(phraseId)
  const { currentLanguage } = useLanguage()

  const [{ data, error, fetching }] = useSelect('phrases', {
    filter: useFilter(
      (query) => query.eq('id', phraseId),
      [phraseId],
    ),
  })

  const phrase = data && data[0]

  return <>
    <BreadcrumbWrapper>
      <BreadcrumbItem to={`/${currentLanguage.id}/practice`}>Practice</BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem to={`/${currentLanguage.id}/practice/${phrase?.id}`}>{phrase?.name}</BreadcrumbItem>
    </BreadcrumbWrapper>

    {
      error ? error.message :
      fetching ? 'loading...' :
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
