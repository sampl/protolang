import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import { useUser } from '@/_state/user'
import { supabase } from '@/db/supabase'

export default () => {
  const { user } = useUser()
  const { langId } = useParams()
  const navigate = useNavigate()

  const [contentIt, setContentIt] = useState('')
  const [contentEn, setContentEn] = useState('')
  const [saving, setSaving] = useState(false)

  async function submit( event ) {
    event.preventDefault()
    try {
      setSaving(true)
      const newData = {
        language_id: langId,
        content_it: contentIt,
        content_en: contentEn,
        // en_alts: enAlts,
        // it_alts: itAlts,
        created_by: user.id,
      }

      const { data: newPhrase, error } = await supabase
        .from('phrases')
        .insert([newData])
        .select()

      if (error) {
        throw error
      }
      navigate(`/${langId}/practice/${newPhrase[0].id}`)
    } catch (error) {
      setSaving(false)
      alert(error.message)
    }
  }

  return <form onSubmit={submit}>
    <h2>New phrase</h2>

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

    <button
      type="submit"
      disabled={saving}
    >
      {saving ? 'Adding...' : 'Add phrase'}
    </button>
  </form>
}
