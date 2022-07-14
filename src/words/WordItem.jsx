import { useParams } from 'react-router-dom'
import { useFilter, useSelect } from 'react-supabase'

import Layout from '@/_layout/Layout'
import MnemonicsList from './MnemonicsList'
import AttemptsList from './AttemptsList'

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

    <h1>{word?.name}</h1>
    <div>({word?.type})</div>
    <div>{word?.translation_en}</div>
    <div>{word?.context_en}</div>

    <a
      href={`https://translate.google.com/?sl=it&tl=en&text=${word?.name}&op=translate`}
      target="_blank"
    >
      Open in Google Translate
    </a>

    <hr />

    <MnemonicsList wordId={id} />

    <hr />

    <AttemptsList wordId={id} />

  </Layout>
}
