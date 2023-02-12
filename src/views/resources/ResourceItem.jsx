import { useParams } from 'react-router-dom'

import { supabase, useSupabaseQuery } from '@/db/supabase'

export default () => {
  let { id } = useParams()

  let query = supabase
    .from('resources')
    .select('*, resource_ratings(*)')
    .eq('id', id)
    .single()
  const [resource, loading, error] = useSupabaseQuery(query, [id])

  return <>
    {
      error ? error.message :
      loading ? 'loading...' :
      !resource ? 'no resource found' :
      <>
        <h1>{resource.url}</h1>
        <a href={resource.url} target="_blank">Visit site ↗</a>
        <br />
        {
          (!resource.resource_ratings || resource.resource_ratings.length <= 0) ? 'no ratings' :
          resource.resource_ratings.map(rr => {
            return <div key={rr.id}>{rr.stars} star(s): {rr.content}</div>
          })
        }
      </>
    }
  </>
}
