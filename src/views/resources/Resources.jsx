import { useSelect, useFilter } from 'react-supabase'
import { Link, useParams } from 'react-router-dom'

import { useLanguage } from '@/_state/language'

export default () => {

  const { currentLanguage } = useLanguage()

  const [{ data: resources, error, fetching }] = useSelect('resources', {
    filter: useFilter(
      (query) => query.eq('language', currentLanguage.id),
      [currentLanguage.id],
    )
  })

  return <>
    <h1>Resources</h1>
    {
      error ? error.message :
      fetching ? 'loading...' :
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
