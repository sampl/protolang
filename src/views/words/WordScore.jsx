import { useUser } from '@/_state/user'
import { useFilter, useSelect } from 'react-supabase'

export default ({ word }) => {

  const { user } = useUser()

  const filter = useFilter(
    (query) => query.eq('word', word?.id).eq('created_by', user?.id),
    [user?.id, word?.id],
  )

  const [{ data: scores, error, fetching }] = useSelect('user_word_scores', { filter })

  // debugger
  const numCorrect = scores?.find(score => score.correct)?.count
  const numIncorrect = scores?.find(score => !score.correct)?.count
  const total = numCorrect + numIncorrect

  const percentage = Math.floor((numCorrect / total) * 100)

  if (fetching) {
    return 'loading...'
  }
  if (error) {
    return `Error: ${error.message}`
  }
  if (!numCorrect || scores?.length === 0) {
    return `you haven't tried to guess this word yet`
  }
  return <>
    {percentage}%
  </>
}
