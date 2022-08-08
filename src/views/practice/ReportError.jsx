import { useState } from 'react'

import { useUser } from '@/_state/user'
import { supabase } from '@/_util/supabaseClient'
import { Button } from '@/styles/Button'

export default ({ word, close }) => {
  const { user } = useUser()

  const [comments, setComments] = useState('')
  const [saving, setSaving] = useState(false)

  async function reportError( event ) {
    event.preventDefault()
    try {
      setSaving(true)

      const newData = {
        created_by: user.id,
        word: word.id,
        comments,
      }

      let { error } = await supabase.from('error_reports').insert([newData])

      if (error) {
        throw error
      }
      alert("We got your error report. Thank you for helping improve the app!")
    } catch (error) {
      alert(error.message)
    } finally {
      setSaving(false)
      setComments('')
      close && close()
    }
  }

  return <form onSubmit={reportError}>

    <label htmlFor="comments">Comments</label>
    <br />
    <textarea
      id="comments"
      value={comments}
      placeholder="Why do you think there's an error?"
      onChange={e => setComments(e.target.value)}
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
