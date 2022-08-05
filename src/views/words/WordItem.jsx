import { useParams } from 'react-router-dom'
import { useFilter, useSelect } from 'react-supabase'

import MnemonicsList from './MnemonicsList'
import AttemptsList from './AttemptsList'
import SpeakWord from './SpeakWord'
import Ngram from './Ngram'
import { useLanguage } from '@/_state/language'
import WordScore from './WordScore'

export default () => {
  const { id } = useParams()
  const { currentLanguage } = useLanguage()

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
    <SpeakWord word={word} />

    <div>({word?.type})</div>
    <div>{word?.translation_en}</div>
    <div>{word?.context_en}</div>

    <a
      href={`https://translate.google.com/?sl=${currentLanguage.code}&tl=en&text=${word?.name}&op=translate`}
      target="_blank"
    >
      Open in Google Translate
    </a>
    {' · '}
    <a
      href={`https://en.wiktionary.org/wiki/${word?.name}#Italian`}
      target="_blank"
    >
      Open in Wiktionary
    </a>

    <hr />

    <MnemonicsList wordId={id} />

    <hr />

    <Ngram word={word} />

    <hr />

    <h3>
      Your accuracy:
      {' '}
      <WordScore word={word} />
    </h3>

    <AttemptsList wordId={id} />

  </>
}
