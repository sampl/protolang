import { useParams } from 'react-router-dom'
import { supabaseDictionaries, useSupabaseQuery } from '@/db/supabase'
import { Link } from 'react-router-dom'

import MnemonicsList from '../mnemonics/MnemonicsList'
import SpeakWord from './SpeakWord'
import Ngram from './Ngram'
import { TwoColumns } from '@/styles/Layout'

export default () => {
  const { langId, wordString } = useParams()
  const wordName = decodeURIComponent(wordString)

  const query = supabaseDictionaries
    .from(langId)
    .select()
    .eq('word', wordName)
  const [definitions, loading, error] = useSupabaseQuery(query)

  // TODO - calculate your accuracy and word score here
  return <div>
    <h1>
      {wordName}
      <SpeakWord wordString={wordName} />
    </h1>
    <TwoColumns cols="5fr 3fr">
      <div>
        {
          error ? error.message :
          loading ? 'loading...' :
          (!definitions || definitions.length <= 0) ? 'Definitions not found' :
          <>
            {definitions.map(word => {

            var {
              pos,
              categories,
              senses,
              forms,
              etymology_text,
              sounds,
            } = word._wiktionary_data
            var ipa = sounds?.[0]?.ipa

            return <div>
                {word._wiktionary_data?.senses[0].glosses.join('\n')}

                <p>Part of speech: {pos}</p>
                <p>Categories: {categories?.join(', ')}</p>
                {etymology_text && <p>{etymology_text}</p>}
                {ipa && <p>IPA: {ipa}</p>}
                <hr />

                <h2>Forms</h2>
                {forms?.map( f => {
                  return <span key={f.form}>
                    <Link to={`/${langId}/dictionary/${f.form}`}>{f.form}</Link>
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
            })}
          </>
        }
      </div>
      <div>
        <a
          href={`https://translate.google.com/?sl=${langId}&tl=en&text=${wordName}&op=translate`}
          target="_blank"
        >
          Open in Google Translate
        </a>
        {' · '}
        <a
          href={`https://en.wiktionary.org/wiki/${wordName}#Italian`}
          target="_blank"
        >
          Open in Wiktionary
        </a>
        {' · '}
        <a
          href={`https://forvo.com/word/${wordName}/#it`}
          target="_blank"
        >
          Pronounce in Forvo
        </a>
        <hr />
        <MnemonicsList string={wordName} />
        <hr />
        <Ngram wordString={wordName} />
      </div>

    </TwoColumns>
  </div>
}
