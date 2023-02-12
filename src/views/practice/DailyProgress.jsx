import moment from 'moment'

import { supabase, useSupabaseQuery } from '@/db/supabase'
import { useUser } from '@/_state/user'
import { useLanguage } from '@/_state/language'

const DAILY_ATTEMPT_GOAL = 20

export default () => {

  const { user } = useUser()
  const { currentLanguage } = useLanguage()

  // TODO - filter to today in the query itself, and only return a count
  let query = supabase
    .from('practice_attempts')
    .select('*, phrase(*)')
    .eq('created_by', user?.id)
  const [data, loading, error] = useSupabaseQuery(query, [user?.id], !user)

  // https://stackoverflow.com/a/47893042/1061063
  const attemptsToday = data?.filter(attempt => !moment(attempt.created_at).isBefore(moment().startOf('day')))

  return <div>
    {
      error ? error.message :
      loading ? 'loading...' :
      <>
        {attemptsToday?.length} / {DAILY_ATTEMPT_GOAL} today
      </>
    }
  </div>
}
