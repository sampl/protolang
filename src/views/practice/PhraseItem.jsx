import { useParams } from 'react-router-dom'

import { supabase, useSupabaseQuery } from '@/db/supabase'
import { BreadcrumbItem, BreadcrumbSeparator, BreadcrumbWrapper } from '@/styles/Breadcrumbs'
import AnswerPhrase from './AnswerPhrase'

export default () => {
  const { langId, phraseId } = useParams()

  const query = supabase
    .from('phrases')
    .select()
    .eq('id', phraseId)
    .single()
  const [phrase, loading, error] = useSupabaseQuery(query, [phraseId])

  if (error) return <div>Error: {error.message}</div>
  if (loading) return <div>Loading...</div>
  if (!phrase) return <div>No phrase found for ID {phraseId}</div>

  return <>
    <BreadcrumbWrapper>
      <BreadcrumbItem to={`/${langId}/practice`}>Practice</BreadcrumbItem>
      <BreadcrumbSeparator />
      {phrase?.content_ita}
    </BreadcrumbWrapper>

    <AnswerPhrase phrase={phrase} />
  </>
}
