import moment from 'moment'
import { useFilter, useSelect } from 'react-supabase'

import { useUser } from '@/_state/user'

export default ({ wordId }) => {

  const { user } = useUser()

  const filter = useFilter(
    (query) => query.eq('word', wordId).eq('created_by', user.id),
    [wordId, user.id],
  )

  const [{ data: attempts, error, fetching }] = useSelect('attempts', {
    filter,
  })

  return <div>
    {error && error.message}
    {fetching && 'loading...'}
    {
      (!attempts || attempts.length <= 0)
      ?
      `you haven't been tested on this word yet`
      :
      attempts.map(attempt => <AttemptsListItem key={attempt.id} attempt={attempt} />)
    }
  </div>
}

const AttemptsListItem = ({attempt}) => {
  return <div>
    {moment(attempt.created_at).format('MM/DD/YYYY')}: "{attempt.guess}" {attempt.correct ? '✅' : '❌'}
  </div>
}
