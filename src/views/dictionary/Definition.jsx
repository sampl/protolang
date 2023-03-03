import { useParams } from 'react-router-dom'
import { supabaseDictionaries, useSupabaseQuery } from '@/db/supabase'
import { Link } from 'react-router-dom'

import SpeakWord from './SpeakWord'
import MnemonicSuggested from '../mnemonics/MnemonicSuggested'

export default ({ wordString }) => {
  const { langId } = useParams()

  const query = supabaseDictionaries
    .from(langId)
    .select()
    .eq('word', wordString)
  const [definitions, loading, error] = useSupabaseQuery(query, [wordString], !wordString)

  if (!wordString || wordString.length <= 0) return 'or click or type a word to see its definition'
  if (loading) return 'loading...'
  if (error) return error.message

  // TODO - calculate your accuracy and word score here
  return <div>
    <h1>
      {wordString}
      <SpeakWord wordString={wordString} />
    </h1>
    {
      error ? error.message :
      loading ? 'loading...' :
      (!definitions || definitions.length <= 0) ? 'Definitions not found' :
      <>
        {
          definitions.map(word => {

            var {
              pos,
              categories,
              senses,
              forms,
              sounds,
            } = word._wiktionary_data
            var ipa = sounds?.[0]?.ipa

            return <div>
              {word._wiktionary_data?.senses[0] && word._wiktionary_data?.senses[0].glosses?.join('\n')}

              <p>Part of speech: {pos}</p>
              <p>Categories: {categories?.join(', ')}</p>
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
          })
        }
      </>
    }
    <MnemonicSuggested string={wordString} />
    <Link to={`/${langId}/dictionary/${wordString}`}>
      Full definition
    </Link>
  </div>
}
