import { useSelect, useFilter } from 'react-supabase'

import { useUser } from "@/_state/user"
import { useLanguage } from '@/_state/language'

export default () => {

  const { user } = useUser()
  const { currentLanguage } = useLanguage()

  const [{ data, error, fetching }] = useSelect('user_scores', {
    pause: !user,
    filter: useFilter(
      (query) => query.eq('created_by', user?.id),
      [user?.id],
    ),
  })

  const score = data ? data[0]?.count : '0'

  return <div>
    {
      !user ? 'Sign in to track your vocab score' :
      error ? error.message :
      fetching ? 'loading...' :
      <>
        Your {currentLanguage?.name_en || ''} vocab score:
        {' '}
        <strong>{score}</strong>
      </>
    }
  </div>
}
