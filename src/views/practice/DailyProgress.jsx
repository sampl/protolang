import moment from 'moment'
import { useFilter, useSelect } from 'react-supabase'
import { Link } from 'react-router-dom'

import { useUser } from '@/_state/user'
import { useLanguage } from '@/_state/language'

const DAILY_ATTEMPT_GOAL = 20

export default () => {

  const { user } = useUser()
  const { currentLanguage } = useLanguage()

  // TODO - filter to today in the query itself, and only return a count
  const [{ data, error, fetching }] = useSelect('practice_attempts', {
    columns: '*, phrase(*)',
    pause: !user,
    filter: useFilter(
      (query) => query.eq('created_by', user?.id),
      [user?.id],
    ),
  })

  // https://stackoverflow.com/a/47893042/1061063
  const attemptsToday = data?.filter(attempt => !moment(attempt.created_at).isBefore(moment().startOf('day')))

  return <div>
    {
      error ? error.message :
      fetching ? 'loading...' :
      <>
        {attemptsToday?.length} / {DAILY_ATTEMPT_GOAL} today
      </>
    }
  </div>
}
