import { Link, useParams } from 'react-router-dom'

import { supabase, useSupabaseQuery } from '@/db/supabase'
import { useLanguage } from '@/_state/language'

export default () => {

  const { currentLanguage } = useLanguage()
  const { lang: urlLang } = useParams()

  let query = supabase
    .from('resources')
    .select()
    .eq('language', currentLanguage.id)
  const [resources, loading, error] = useSupabaseQuery(query, [currentLanguage.id])

  return <>
    <h1>Resources</h1>
    <Link to={`/${urlLang}/resources/new`}>+ Add resource</Link>

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
  const { lang: urlLang } = useParams()

  return <div>
    <Link to={`/${urlLang}/resources/${resource.id}`}>
      {resource.url || 'Unknown url'}
    </Link>
  </div>
}
