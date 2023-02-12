import moment from 'moment'
import { Link } from 'react-router-dom'

import { supabase, useSupabaseQuery } from '@/db/supabase'
import { useUser } from '@/_state/user'
import { useLanguage } from '@/_state/language'

export default () => {

  const { user } = useUser()
  const { currentLanguage } = useLanguage()

  let query = supabase
    .from('practice_attempts')
    .select('*, phrase(*)')
    .eq('created_by', user?.id)
  const [data, loading, error] = useSupabaseQuery(query, [user?.id], !user)

  const attempts = data?.sort((a, b) => moment(b.created_at).valueOf() - moment(a.created_at).valueOf())

  return <div>
    {
      !user ? <>
        <Link to="/signup">Create an account</Link>
        {' '}
        to track your attempts
      </> :
      error ? error.message :
      loading ? 'loading...' :
      (!attempts || attempts.length <= 0) ? `Try some flashcards to see your attempts` :
      <table style={{width: "100%"}}>
        <thead>
          <tr>
            <td>Date</td>
            <td>Italian</td>
            <td>English</td>
            <td>Your guess</td>
            <td>Correct?</td>
          </tr>
        </thead>
        <tbody>
          {
            attempts.map(attempt => {
              return <tr key={attempt?.id}>
                <td>{moment(attempt.created_at).format('MM/DD/YYYY')}</td>
                <td>
                  <Link to={`/${currentLanguage.id}/practice/${attempt.phrase.id}`}>
                    {attempt.phrase.name}
                  </Link>
                </td>
                <td>{attempt.phrase.translation_en}</td>
                <td>"{attempt.guess}"</td>
                <td>{attempt.is_correct ? '✅' : '❌'}</td>
              </tr>
            })
          }
        </tbody>
      </table>
    }
  </div>
}
