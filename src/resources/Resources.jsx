import { useSelect } from 'react-supabase'
import { Link } from 'react-router-dom'

import Layout from '../_layout/Layout'

export default function Resources() {

  const [{ data: resources, error, fetching }] = useSelect('resources')

  return <Layout>
    <h1>Resources</h1>
    {error && error.message}
    {fetching && 'loading...'}
    {
      (!resources || resources.length <= 0)
      ?
      'no resources'
      :
      resources.map(resource => <ResourceListItem key={resource.id} resource={resource} />)
    }
  </Layout>
}

const ResourceListItem = ({resource}) => {
  return <Link to={`/resources/${resource.id}`}>
    {resource.url || 'Unknown url'}
  </Link>
}
