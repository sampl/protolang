import { useState } from 'react'
import styled from 'styled-components/macro'

import {supabase} from '@/db/supabase'

export default ({ ita, eng }) => {

  const [translation, setTranslation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)

  let fromLang, toLang, sourcePhrase
  if (ita) {
    fromLang = 'Italian'
    toLang = 'English'
    sourcePhrase = ita
  } else if (eng) {
    fromLang = 'English'
    toLang = 'Italian'
    sourcePhrase = eng
  }

  const runTranslation = async () => {
    console.log('triggering remote function')
    if (!fromLang || !toLang) {
      setError('Missing language')
      return
    }
    setLoading(true)
    setCopied(false)
    const prompt = `Please translate the following from ${fromLang} to ${toLang}: "${sourcePhrase}"`
    const { data, error } = await supabase.functions.invoke('ai_prompt', {
      body: { prompt },
    })
    setError(null)
    if (error) setError(error.message)
    setTranslation(data?.promptResponse && data.promptResponse.trim())
    setLoading(false)
  }

  const copyTranslation = async () => {
    // https://stackoverflow.com/a/52033479/1061063
    navigator.clipboard.writeText(translation)
    setCopied(true)
  }

  if (!sourcePhrase || sourcePhrase.length < 1) return null

  return <TranslateHelperWrapper>
    {
      error ? `Error: ${error}` : 
      loading ? '...' :
      translation ? <>{translation} <button type="button" onClick={copyTranslation}>{copied ? 'Copied' : 'Copy'}</button></> :
      <button type="button" onClick={runTranslation} disabled={!sourcePhrase}>Click to translate "{sourcePhrase}"</button>
    }
  </TranslateHelperWrapper>
}

const TranslateHelperWrapper = styled.div`
  font-size: small;
  margin: -0.5rem 0 0.5rem;
`
