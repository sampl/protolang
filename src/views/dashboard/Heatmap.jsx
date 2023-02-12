import moment from 'moment'

import { supabase, useSupabaseQuery } from '@/db/supabase'
import { HeatmapCell, HeatmapWrapper, HeatmapEmptyStateWrapper, HeatmapEmptyStateMessage } from "@/styles/Heatmap"
import { useUser } from "@/_state/user"
import { Link } from 'react-router-dom'

const getColor = attempts => {
  return attempts >= 1000 ? 'var(--diablo)' :
         attempts >=  500 ? 'var(--fire)' :
         attempts >=   75 ? 'var(--hot)' :
         attempts >=   10 ? 'var(--medium)' :
         attempts >=    1 ? 'var(--mild)' :
                            'var(--empty)'
}

export default () => {

  const { user } = useUser()

  // empty array of days
  // TODO - offset for day of the week
  const start = moment().add(-365, 'days')
  const emptyDays = Array.from(new Array(365))
    .map( (_, index) => ({
      date: moment(start).add(index, 'day').format('YYYY-MM-DD'),
    }))

  // get activity data
  let query = supabase
    .from('heatmap_days')
    .select()
    .eq('created_by', user?.id)
  const [dataDays, loading, error] = useSupabaseQuery(query, [user?.id], !user)

  // merge data with empty array
  const days = !user ? emptyDays : emptyDays.map(ed => {
    const dataDay = dataDays?.find(dd => dd.date === ed.date)
    return {
      ...ed,
      attempts: dataDay?.count || 0,
    }
  })

  return <div>
    {
      error ? error.message :
      loading ? 'loading...' :
      <>
        <h3>Practice frequency</h3>
        <HeatmapWrapper padding={2}>
          {!user && 
            <HeatmapEmptyStateWrapper>
              <HeatmapEmptyStateMessage>
                <Link to="/signup">Create an account</Link>
                {' '}
                to see your daily activity
              </HeatmapEmptyStateMessage>
            </HeatmapEmptyStateWrapper>
          }
          {days.map(day => {
            const background = getColor(day.attempts)
            return <HeatmapCell key={day.date} size={10} background={background} />
          })}
        </HeatmapWrapper>
      </>
    }
  </div>

}
