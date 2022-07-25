import { useUser } from '@/_state/user'
import { useFilter, useSelect } from 'react-supabase'

export default ({ word }) => {

  const { user } = useUser()

  const filter = useFilter(
    (query) => query
      .eq('word', word?.id)
      .eq('created_by', user?.id),
    [user?.id, word?.id],
  )

  const [{ data, error, fetching }] = useSelect('user_word_scores', { filter })

  const wordScore = data && data[0]

  if (fetching) {
    return 'loading...'
  }
  if (error) {
    return `Error: ${error.message}`
  }
  if (!wordScore?.count > 0) {
    return `you haven't tried to guess this word yet`
  }
  return <>
    {wordScore.percent_correct}%
  </>
}
