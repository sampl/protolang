import { useParams } from 'react-router-dom'

import { supabase, useSupabaseQuery } from '@/db/supabase'
import ResourceVote from './ResourceVote'

export default () => {
  const { resourceId } = useParams()

  const query = supabase
    .from('resources')
    .select('*, resource_votes(*)')
    .eq('id', resourceId)
    .single()
  const [resource, loading, error] = useSupabaseQuery(query, [resourceId])

  return <>
    {
      error ? error.message :
      loading ? 'loading...' :
      !resource ? 'no resource found' :
      <>
        <h1>{resource.url}</h1>
        <a href={resource.url} target="_blank">Visit site ↗</a>
        <ResourceVote resource={resource} />
      </>
    }
  </>
}
