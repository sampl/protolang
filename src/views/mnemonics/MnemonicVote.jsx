import { useState } from 'react'
import { useParams } from 'react-router-dom'

import { useUser } from '@/_state/user'
import { supabase, useSupabaseQuery } from '@/db/supabase'

export default ({ mnemonic }) => {
  const { user } = useUser()
  const { langId } = useParams()

  const [saving, setSaving] = useState(false)

  const currentlyUpvoted = mnemonic.user_votes?.length > 0

  async function toggleVote() {
    if (!user) {
      alert('You must be logged in to vote')
      return
    }

    try {
      setSaving(true)
      const newData = {
        language_id: langId,
        mnemonic_id: mnemonic.id,
        is_upvoted: !currentlyUpvoted,
        created_by: user.id,
      }

      const { error } = await supabase
        .from('mnemonic_votes')
        .upsert([newData])
        .eq('mnemonic_id', mnemonic.id)
        .eq('created_by', user.id)
        .select()

      if (error) {
        throw error
      }
      setSaving(false)
      location.reload() // TODO - realtime or save state
    } catch (error) {
      alert(error.message)
    }
  }

  return <>
    <button onClick={toggleVote} disabled={saving}>
      {currentlyUpvoted ? '▲' : '△'}
    </button>
  </>
}
