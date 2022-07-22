import { useEffect, useState } from "react"

import { supabase } from '@/_util/supabaseClient'
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
    attempts: 5,
  },
  {
    date: '2022-01-04',
    attempts: 15,
  },
  {
    date: '2022-01-05',
    attempts: 50,
  },
  {
    date: '2022-01-06',
    attempts: 500,
  },
  {
    date: '2022-01-020',
    attempts: 1000,
  },
]

const getColor = count => {
  return count > 1000 ? 'var(--diablo)' :
         count >  500 ? 'var(--fire)' :
         count >   75 ? 'var(--hot)' :
         count >   10 ? 'var(--medium)' :
         count >    0 ? 'var(--mild)' :
                        'var(--empty)'
}
export default () => {

  const [error, setError] = useState()
  const [data, setData] = useState()

  useEffect( () => {
    const getData = async () => {
      const { data, error } = await supabase.rpc('get_user_activity_heatmap')
      setData(data)
      setError(error)
    }
    getData()
  }, [])

  const days = data || TEST_DAYS

  return <div>
    {error && error.message}
    <br/>
    {JSON.stringify(data)}

    <hr />

    <HeatmapWrapper padding={2}>
      {days.map(d => {
        return <HeatmapCell size={10} background={getColor(d.attempts)} />
      })}
    </HeatmapWrapper>
  </div>
}
