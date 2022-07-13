import { useParams } from 'react-router-dom'
import { useFilter, useSelect } from 'react-supabase'

import Layout from '@/_layout/Layout'

export default function WordItem() {
  let { id } = useParams()

  const filter = useFilter(
    (query) => query.eq('id', id),
    [id],
  )

  const [{ data, error, fetching }] = useSelect('words', { filter })

  const word = data && data[0]

  return <Layout>
    {error && error.message}
    {fetching && 'loading...'}

    <h1>{word && word.name}</h1>
    <div>({word && word.type})</div>
    <div>{word && word.translation_en}</div>
    <div>{word && word.context_en}</div>
  </Layout>
}
