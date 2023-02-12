import { Link, useParams } from 'react-router-dom'

import { supabase, useSupabaseQuery } from '@/db/supabase'
import { useLanguage } from '@/_state/language'

export default () => {

  const { currentLanguage } = useLanguage()
  const { langId } = useParams()

  let query = supabase
    .from('resources')
    .select()
    .eq('language', currentLanguage.id)
  const [resources, loading, error] = useSupabaseQuery(query, [currentLanguage.id])

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
