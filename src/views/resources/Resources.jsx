import { Link, useParams } from 'react-router-dom'

import { supabase, useSupabaseQuery } from '@/db/supabase'

export default () => {

  const { langId } = useParams()

  let query = supabase
    .from('resources')
    .select()
    .eq('language', langId)
  const [resources, loading, error] = useSupabaseQuery(query, [langId])

  return <>
    <h1>Resources</h1>
    <Link to={`/${langId}/resources/new`}>+ Add resource</Link>

    <hr />

    {
      error ? error.message :
      loading ? 'loading...' :
      (!resources || resources.length <= 0) ? 'no resources' :
      resources.map(resource => <ResourceListItem key={resource.id} resource={resource} />)
    }
  </>
}

const ResourceListItem = ({resource}) => {
  const { langId } = useParams()

  return <div>
    <Link to={`/${langId}/resources/${resource.id}`}>
      {resource.url || 'Unknown url'}
    </Link>
  </div>
}
