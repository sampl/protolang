import { useState } from 'react'

import { useUser } from '@/_state/user'
import { supabase } from '@/db/supabase'
import { Button } from '@/styles/Button'
import Modal from '@/styles/Modal'
import { logError } from '../../_util/error.js'

export default ({ phrase }) => {
  const { user } = useUser()

  const [issueReporterIsOpen, setIssueReporterIsOpen] = useState(false)
  const [comment, setComment] = useState('')
  const [saving, setSaving] = useState(false)

  async function reportIssue( event ) {
    event.preventDefault()
    event.stopPropagation()

    try {
      setSaving(true)

      const newData = {
        language_id: phrase.language_id,
        phrase_id: phrase.id,
        comment: comment,
        created_by: user.id,
      }

      const { error } = await supabase
        .from('phrase_issues')
        .insert([newData])

      if (error) {
        throw error
      }
      alert("We got your error report. Thank you for helping improve the app!")
      setIssueReporterIsOpen(false)
    } catch (error) {
      setSaving(false)
      logError('report phrase issue', error)
    }
  }

  return <>
    <button type="button" onClick={() => setIssueReporterIsOpen(true)}>Report issue</button>

    <Modal isOpen={issueReporterIsOpen} onClose={() => setIssueReporterIsOpen(false)}>
      <form onSubmit={reportIssue}>

        <label>English</label>
        <p>"{phrase.content_eng}"</p>

        <label>Italian</label>
        <p>"{phrase.content_ita}"</p>

        <label htmlFor="comment">Comment</label>
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
    </Modal>
  </>

}
