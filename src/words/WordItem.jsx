import { useParams } from 'react-router-dom'
import { useFilter, useSelect } from 'react-supabase'

import MnemonicsList from './MnemonicsList'
import AttemptsList from './AttemptsList'
import Speech from './Speech'
import { useLanguage } from '@/_state/language'

export default () => {
  const { id } = useParams()
  const { currentLanguageCode } = useLanguage()

  const filter = useFilter(
    (query) => query.eq('id', id),
    [id],
  )

  const [{ data, error, fetching }] = useSelect('words', { filter })

  const word = data && data[0]

  return <>
    {error && error.message}
    {fetching && 'loading...'}

    <h1>{word?.name}</h1>
    <Speech word={word} />

    <div>({word?.type})</div>
    <div>{word?.translation_en}</div>
    <div>{word?.context_en}</div>

    <a
      href={`https://translate.google.com/?sl=${currentLanguageCode}&tl=en&text=${word?.name}&op=translate`}
      target="_blank"
    >
      Open in Google Translate
    </a>

    <hr />

    <MnemonicsList wordId={id} />

    <hr />

    <AttemptsList wordId={id} />

  </>
}
