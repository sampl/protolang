import { useUser } from '@/_state/user'
import { useFilter, useSelect } from 'react-supabase'

export default ({ word }) => {

  const { user } = useUser()

  const [{ data, error, fetching }] = useSelect('user_word_scores', {
    pause: !user,
    filter: useFilter(
      (query) => query
        .eq('word', word?.id)
        .eq('created_by', user?.id),
      [user?.id, word?.id],
    )
  })

  const wordScore = data && data[0]

  if (!user) {
    return `??`
  }
  if (fetching) {
    return '...'
  }
  if (error) {
    return `(Error)`
  }
  if (!wordScore?.count > 0) {
    return `0%`
  }
  return <>
    {Math.floor(wordScore.percent_correct * 100)}%
  </>
}
