import { useState } from 'react'

import { useUser } from '@/_state/user'
import { supabase } from '@/db/supabase'
import { Button } from '@/styles/Button'

export default ({ phrase, close }) => {
  const { user } = useUser()

  const [comment, setComment] = useState('')
  const [saving, setSaving] = useState(false)

  async function reportError( event ) {
    event.preventDefault()
    try {
      setSaving(true)

      const newData = {
        language: phrase.language,
        phrase: phrase.id,
        comment: comment,
        created_by: user.id,
      }

      let { error } = await supabase.from('phrase_issues').insert([newData])

      if (error) {
        throw error
      }
      alert("We got your error report. Thank you for helping improve the app!")
    } catch (error) {
      alert(error.message)
    } finally {
      setSaving(false)
      setComment('')
      close && close()
    }
  }

  return <form onSubmit={reportError}>

    <label htmlFor="comment">Comment</label>
    <br />
    <textarea
      id="comment"
      value={comment}
      placeholder="Why do you think there's an error?"
      onChange={e => setComment(e.target.value)}
    />

    <br />
    <Button
      type="submit"
      disabled={saving}
    >
      {saving ? 'Reporting...' : 'Report error'}
    </Button>
  </form>
}
