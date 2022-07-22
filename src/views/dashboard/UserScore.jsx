import { useSelect, useFilter } from 'react-supabase'

import { useUser } from "@/_state/user"

export default () => {

  const { user } = useUser()

  const filter = useFilter(
    (query) => query.eq('created_by', user.id),
    [user.id],
  )
  const [{ data, error, fetching }] = useSelect('user_scores', { filter })
  
  const score = data && data[0]?.count

  return <div>
    {
      error ? error.message :
      fetching ? 'loading...' :
      <>
        Your Italian vocab score:
        {' '}
        <strong>{score}</strong>
      </>
    }
  </div>
}
