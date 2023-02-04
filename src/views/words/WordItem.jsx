import { useParams } from 'react-router-dom'
import { useFilter, useSelect } from 'react-supabase'

import MnemonicsList from './MnemonicsList'
import AttemptsList from './AttemptsList'
import SpeakWord from './SpeakWord'
import Ngram from './Ngram'
import { useLanguage } from '@/_state/language'
import WordScore from './WordScore'

export default () => {
  const { string } = useParams()
  const name = decodeURIComponent(string)
  const { currentLanguage } = useLanguage()

  const [{ data, error, fetching }] = useSelect('words', {
    filter: useFilter(
      (query) => query.eq('name', name),
      [name],
    ),
  })

  const word = data && data[0]

  return <>
    {
      error ? error.message :
      fetching ? 'loading...' :
      <>
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
        {' · '}
        <a
          href={`https://forvo.com/word/${word?.name}/#it`}
          target="_blank"
        >
          Pronounce in Forvo
        </a>

        <hr />

        <MnemonicsList wordId={word?.id} />

        <hr />

        <Ngram word={word} />

        <hr />

        <h3>
          Your accuracy:
          {' '}
          <WordScore word={word} />
        </h3>

        <AttemptsList wordId={word?.id} />
      </>
    }
  </>
}
