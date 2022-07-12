import { useFilter, useSelect } from 'react-supabase'
import { useParams } from 'react-router-dom'

import Layout from '../_layout/Layout'

export default function ResourceItem() {
  let { id } = useParams()

  const filter = useFilter(
    (query) => query.eq('id', id),
    [id],
  )

  const [{ data, error, fetching }] = useSelect('resources', { filter })

  const resource = data && data[0]

  return <Layout>
    {error && error.message}
    {fetching && 'loading...'}

    <h1>{resource && resource.url}</h1>
  </Layout>
}
