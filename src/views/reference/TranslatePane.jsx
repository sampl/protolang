import { useEffect, useState } from 'react'
// import styled from 'styled-components/macro'
import { useDebounce } from 'use-debounce'

import { supabase } from '@/db/supabase'

export default ({ wordString }) => {

  const [wordStringDebounced] = useDebounce(wordString, 500, { leading: true })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [translation, setTranslation] = useState('')

  useEffect(() => {
    const triggerRemoteFunction = async () => {
      if (!wordStringDebounced || wordStringDebounced.trim() === '') {
        setLoading(false)
        return
      }
      setLoading(true)
      console.log('triggering remote function')
      const fromLang = 'Italian'
      const toLang = 'English'
      const prompt = `Please translate the following from ${fromLang} to ${toLang}: "${wordStringDebounced}"`
      const { data, error } = await supabase.functions.invoke('ai_prompt', {
        body: { prompt },
      })
      console.log(data, error)
      setLoading(false)
      error && console.log(error)
      error ? setError(error) : setError(null)
      setTranslation(data?.promptResponse && data.promptResponse.trim())
    }
    triggerRemoteFunction()
  }, [wordStringDebounced])

  if (loading) return 'loading...'
  if (error) return "Error: " + error.message

  return <div>
    {translation || '(Type to translate text...)'}
  </div>
}

// const ReferencePanelWrapper = styled.div`
// `
