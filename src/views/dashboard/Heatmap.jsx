import { useEffect, useState } from "react"
import moment from 'moment'

// import { supabase } from '@/_util/supabaseClient'
import { HeatmapCell, HeatmapWrapper } from "@/styles/Heatmap"

const TEST_DAYS = [
  {
    date: '2022-01-01',
    attempts: 0,
  },
  {
    date: '2022-01-02',
    attempts: 1,
  },
  {
    date: '2022-01-03',
    attempts: 10,
  },
  {
    date: '2022-01-04',
    attempts: 75,
  },
  {
    date: '2022-01-06',
    attempts: 500,
  },
  {
    date: '2022-01-20',
    attempts: 1000,
  },
]

const getColor = attempts => {
  return attempts >= 1000 ? 'var(--diablo)' :
         attempts >=  500 ? 'var(--fire)' :
         attempts >=   75 ? 'var(--hot)' :
         attempts >=   10 ? 'var(--medium)' :
         attempts >=    1 ? 'var(--mild)' :
                            'var(--empty)'
}

export default () => {

  const [error, setError] = useState()
  const [days, setDays] = useState([])

  useEffect( () => {
    const getData = async () => {

      // empty array of days
      // TODO - offset for day of the week
      const start = moment().add(-365, 'days')
      const emptyDays = Array.from(new Array(365))
        .map( (_, index) => ({
          date: moment(start).add(index, 'day').format('YYYY-MM-DD'),
        }))

      // const { data: dataDays, error } = await supabase.rpc('get_user_activity_heatmap')
      const dataDays = TEST_DAYS
      
      // merge data with empty array
      const days = emptyDays.map(ed => {
        const dataDay = dataDays.find(dd => dd.date === ed.date)
        return {
          ...ed,
          attempts: dataDay?.attempts || 0,
        }
      })

      setDays(days)
      setError(error)
    }
    getData()
  }, [])

  return <div>
    {error && error.message}

    <hr />

    <HeatmapWrapper padding={2}>
      {days.map(day => {
        const background = getColor(day.attempts)
        return <HeatmapCell key={day.date} size={10} background={background} />
      })}
    </HeatmapWrapper>
  </div>

}
