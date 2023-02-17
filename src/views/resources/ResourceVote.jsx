import { useState } from 'react'
import { useParams } from 'react-router-dom'

import { useUser } from '@/_state/user'
import { supabase, useSupabaseQuery } from '@/db/supabase'

export default ({ resource }) => {
  const { user } = useUser()
  const { langId } = useParams()

  const [saving, setSaving] = useState(false)

  const resourceVoteQuery = supabase
    .from('resource_votes')
    .select()
    .eq('resource_id', resource.id)
    .eq('created_by', user?.id)
    .eq('is_upvoted', true)
  const [resourceVotes, loading, error] = useSupabaseQuery(resourceVoteQuery)

  const currentlyUpvoted = resourceVotes?.length > 0

  async function toggleVote() {
    if (!user) {
      alert('You must be logged in to vote')
      return
    }

    try {
      setSaving(true)
      // debugger
      const newData = {
        language_id: langId,
        resource_id: resource.id,
        is_upvoted: !currentlyUpvoted,
        created_by: user.id,
      }

      const { error } = await supabase
        .from('resource_votes')
        .upsert([newData])
        .eq('resource_id', resource.id)
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
