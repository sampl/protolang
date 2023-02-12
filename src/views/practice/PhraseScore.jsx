import { useUser } from '@/_state/user'

import { supabase, useSupabaseQuery } from '@/db/supabase'

export default ({ phrase }) => {

  const { user } = useUser()

  let query = supabase
    .from('user_phrase_scores')
    .select()
    .eq('phrase', phrase?.id)
    .eq('created_by', user?.id)
    .single()
  const [phraseScore, loading, error] = useSupabaseQuery(query, [user?.id, phrase?.id], !user)

  if (!user) {
    return `??`
  }
  if (loading) {
    return '...'
  }
  if (error) {
    return `(Error)`
  }
  if (!phraseScore?.count > 0) {
    return `0%`
  }
  return <>
    {Math.floor(phraseScore.percent_correct * 100)}%
  </>
}
