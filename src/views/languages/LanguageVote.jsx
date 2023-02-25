import { useState } from 'react'

import { useUser } from '@/_state/user'
import { supabase, useSupabaseQuery } from '@/db/supabase'
import { logError } from '../../_util/error.js'

export default ({ language }) => {
  const { user } = useUser()

  const [saving, setSaving] = useState(false)

  const languageVoteQuery = supabase
    .from('language_votes')
    .select()
    .eq('language_id', language.id)
    .eq('created_by', user?.id)
    .eq('is_upvoted', true)
  const [languageVotes, loading, error] = useSupabaseQuery(languageVoteQuery)

  const currentlyUpvoted = languageVotes?.length > 0

  async function toggleVote() {
    if (!user) {
      alert('You must be logged in to vote')
      return
    }

    try {
      setSaving(true)
      const newData = {
        language_id: language.id,
        is_upvoted: !currentlyUpvoted,
        created_by: user.id,
      }

      const { error } = await supabase
        .from('language_votes')
        .upsert([newData])
        .eq('language_id', language.id)
        .eq('created_by', user.id)
        .select()

      if (error) {
        throw error
      }
      setSaving(false)
      location.reload() // TODO - realtime or save state
    } catch (error) {
      logError('toggle language vote', error)
    }
  }

  return <>
    <button onClick={toggleVote} disabled={saving || loading || error}>
      {currentlyUpvoted ? '✅ Voted' : 'Vote for this language'}
    </button>
  </>
}
