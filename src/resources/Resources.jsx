import { useSelect, useFilter } from 'react-supabase'
import { Link } from 'react-router-dom'

import { useLanguage } from '@/_state/language'
import Layout from '@/_layout/Layout'

export default () => {

  const { currentLanguageId } = useLanguage()

  const filter = useFilter(
    (query) => query.eq('language', currentLanguageId),
    [currentLanguageId],
  )

  const [{ data: resources, error, fetching }] = useSelect('resources', { filter })

  return <Layout>
    <h1>Resources</h1>
    {
      error ? error.message :
      fetching ? 'loading...' :
      (!resources || resources.length <= 0) ? 'no resources' :
      resources.map(resource => <ResourceListItem key={resource.id} resource={resource} />)
    }
  </Layout>
}

const ResourceListItem = ({resource}) => {
  return <div>
    <Link to={`/resources/${resource.id}`}>
      {resource.url || 'Unknown url'}
    </Link>
  </div>
}
