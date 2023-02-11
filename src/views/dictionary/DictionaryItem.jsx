import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { supabaseDictionaries } from '@/_util/supabaseClient'
import { Link } from 'react-router-dom'

import MnemonicsList from './MnemonicsList'
import SpeakWord from './SpeakWord'
import Ngram from './Ngram'
import { useLanguage } from '@/_state/language'
import { TwoColumns } from '@/styles/Layout'

export default () => {
  const { wordString } = useParams()
  const wordName = decodeURIComponent(wordString)

  const { currentLanguage } = useLanguage()

  const [fetching, setFetching] = useState(true)
  const [data, setData] = useState()
  const [error, setError] = useState()

  useEffect(() => {
    const doThing = async () => {
      const { data, error } = await supabaseDictionaries
        .from(currentLanguage.id)
        .select()
        .eq('word', wordName)
      setFetching(false)
      setData(data)
      setError(error)
    }
    doThing()
  }, [])

  const word = data && data[0]

  if (word) {
    var {
      pos,
      categories,
      senses,
      forms,
      etymology_text,
      sounds,
    } = word?._wiktionary_data
    var ipa = sounds?.[0]?.ipa
  }

  // debugger

  // TODO - calculate your accuracy and word score here
  return <div>
    {
      error ? error.message :
      fetching ? 'loading...' :
      !word ? 'Word not found' :
      <>
        <h1>
          {word?.word}
          <SpeakWord wordString={word?.word} />
        </h1>
        <TwoColumns>
          <div>
            <p>Part of speech: {pos}</p>
            <p>Categories: {categories?.join(', ')}</p>
            {etymology_text && <p>{etymology_text}</p>}
            {ipa && <p>IPA: {ipa}</p>}
            <hr />

            <h2>Forms</h2>
            {forms?.map( f => {
              return <span key={f.form}>
                <Link to={`/${currentLanguage.id}/dictionary/${f.form}`}>{f.form}</Link>
                {' '}
              </span>
            })}

            <h2>Senses</h2>
            {senses?.map( sense => {
              return <div key={sense.id}>
                <p>{sense?.tags?.join(', ')}</p>
              </div>
            })}

          </div>
          <div>
            <a
              href={`https://translate.google.com/?sl=${currentLanguage.id}&tl=en&text=${word.word}&op=translate`}
              target="_blank"
            >
              Open in Google Translate
            </a>
            {' · '}
            <a
              href={`https://en.wiktionary.org/wiki/${word.word}#Italian`}
              target="_blank"
            >
              Open in Wiktionary
            </a>
            {' · '}
            <a
              href={`https://forvo.com/word/${word.word}/#it`}
              target="_blank"
            >
              Pronounce in Forvo
            </a>
            <hr />
            <MnemonicsList string={word.word} />
            <hr />
            <Ngram wordString={word.word} />
          </div>

        </TwoColumns>
      </>
    }
  </div>
}
