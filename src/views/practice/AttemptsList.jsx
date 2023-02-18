import moment from 'moment'
import { Link } from 'react-router-dom'

import { supabase, useSupabaseQuery } from '@/db/supabase'
import { useUser } from '@/_state/user'
import { useLanguage } from '@/_state/language'

export default () => {

  const { user } = useUser()
  const { currentLanguage } = useLanguage()

  const query = supabase
    .from('practice_attempts')
    .select('*, phrase(*)')
    .eq('created_by', user?.id)
    .eq('language_id', currentLanguage?.id)
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
      <table>
        <thead>
          <tr>
            <td>Date</td>
            <td>Direction</td>
            <td>Italian</td>
            <td>English</td>
            <td>Prompt type</td>
            <td>Answer type</td>
            <td>Your guess</td>
            <td>Correct?</td>
          </tr>
        </thead>
        <tbody>
          {
            attempts.map(attempt => {
              return <tr key={attempt?.id}>
                <td>{moment(attempt.created_at).format('MM/DD/YYYY')}</td>
                <td>{attempt.direction === 'forward' ? 'English to Italian' : 'Italian to English'}</td>
                <td>
                  <Link to={`/${currentLanguage.id}/practice/${attempt.phrase.id}`}>
                    {attempt.phrase.content_it}
                  </Link>
                </td>
                <td>{attempt.phrase.content_en}</td>
                <td>{attempt.prompt_type}</td>
                <td>{attempt.answer_type}</td>
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
