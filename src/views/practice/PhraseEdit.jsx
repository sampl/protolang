import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import { supabase, useSupabaseQuery } from '@/db/supabase'

export default () => {
  const { langId, phraseId } = useParams()
  const navigate = useNavigate()

  const [contentIt, setContentIt] = useState('')
  const [contentEn, setContentEn] = useState('')
  const [saving, setSaving] = useState(false)

  const phraseQuery = supabase
    .from('phrases')
    .select()
    .eq('id', phraseId)
    .single()
  const [phrase, phraseLoading, phraseError] = useSupabaseQuery(phraseQuery, [phraseId])

  // all this crap should go away when we start using a backend
  useEffect(() => {
    if (phrase) {
      setContentIt(phrase.content_it)
      setContentEn(phrase.content_en)
    }
  }, [phrase])

  async function submit( event ) {
    event.preventDefault()
    try {
      setSaving(true)
      const newData = {
        content_it: contentIt,
        content_en: contentEn,
      }

      const { error } = await supabase
        .from('phrases')
        .update(newData)
        .eq('id', phraseId)

      if (error) {
        throw error
      }
      navigate(`/${langId}/practice/${phraseId}`)
    } catch (error) {
      setSaving(false)
      alert(error.message)
    }
  }

  if (phraseError) return phraseError.message
  if (phraseLoading) return 'loading...'

  return <form onSubmit={submit}>
    <h2>Edit phrase</h2>

    <label htmlFor="contentIt">Italian</label>
    <textarea
      id="contentIt"
      value={contentIt}
      placeholder=""
      onChange={e => setContentIt(e.target.value)}
      required
    />

    <label htmlFor="contentEn">English</label>
    <textarea
      id="contentEn"
      value={contentEn}
      placeholder=""
      onChange={e => setContentEn(e.target.value)}
      required
    />

    <br />

    <button type="submit" disabled={saving}>
      {saving ? 'Saving...' : 'Save phrase'}
    </button>
  </form>
}
