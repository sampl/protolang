import { useSelect, useFilter } from 'react-supabase'
import { Link } from 'react-router-dom'

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
    <h3>Vocabulary score</h3>
    {
      !user ? <>
        <Link to="/signup">Create an account</Link>
        {' '}
        to track your vocab score
      </> :
      error ? error.message :
      fetching ? 'loading...' :
      <>
        {currentLanguage?.name_en || ''} vocabulary estimate:
        {' '}
        <strong>{score}</strong>
        {' '}
        words
      </>
    }
  </div>
}
