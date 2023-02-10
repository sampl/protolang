import { useUser } from '@/_state/user'
import { useFilter, useSelect } from 'react-supabase'

export default ({ phrase }) => {

  const { user } = useUser()

  const [{ data, error, fetching }] = useSelect('user_phrase_scores', {
    pause: !user,
    filter: useFilter(
      (query) => query
        .eq('phrase', phrase?.id)
        .eq('created_by', user?.id),
      [user?.id, phrase?.id],
    )
  })

  const phraseScore = data && data[0]

  if (!user) {
    return `??`
  }
  if (fetching) {
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
