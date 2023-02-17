import { useState } from 'react'
import { useParams } from 'react-router-dom'

import { useUser } from '@/_state/user'
import { supabase, useSupabaseQuery } from '@/db/supabase'

export default ({ media }) => {
  const { user } = useUser()
  const { langId } = useParams()

  const [saving, setSaving] = useState(false)

  const mediaVoteQuery = supabase
    .from('media_votes')
    .select()
    .eq('media_id', media.id)
    .eq('created_by', user?.id)
    .eq('is_upvoted', true)
  const [mediaVotes, loading, error] = useSupabaseQuery(mediaVoteQuery)

  const currentlyUpvoted = mediaVotes?.length > 0

  async function toggleVote() {
    if (!user) {
      alert('You must be logged in to vote')
      return
    }

    try {
      setSaving(true)
      const newData = {
        language_id: langId,
        media_id: media.id,
        is_upvoted: !currentlyUpvoted,
        created_by: user.id,
      }

      const { error } = await supabase
        .from('media_votes')
        .upsert([newData])
        .eq('media_id', media.id)
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
    <button onClick={toggleVote} disabled={saving || loading || error}>
      {currentlyUpvoted ? '▲' : '△'}
    </button>
  </>
}
