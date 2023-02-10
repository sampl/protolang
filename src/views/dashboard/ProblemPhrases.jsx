import { useUser } from '@/_state/user'
import { useFilter, useSelect } from 'react-supabase'
import { Link, useParams } from 'react-router-dom'

export default () => {

  const { user } = useUser()
  const { lang: urlLang } = useParams()

  const [{ data: phraseScores, error, fetching }] = useSelect('user_phrase_scores', {
    columns: '*, phrase(*)',
    pause: !user,
    filter: useFilter(
      (query) => query
        .eq('created_by', user?.id)
        .order('percent_correct', { ascending: true })
        .limit(5),
      [user?.id],
    ),
  })

  return <>
    <h3>Problem phrases</h3>
    {
      !user ? <>
        <Link to="/signup">Create an account</Link>
        {' '}
        to see the phrases you make the most mistakes on
      </> :
      error ? error.message :
      fetching ? 'loading...' :
      (!phraseScores || phraseScores.length <= 0) ? 'no problem phrases!' :
      phraseScores?.map(phraseScore => {
        return <div key={phraseScore.phrase.id}>
          <Link to={`/${urlLang}/practice/${phraseScore.phrase.id}`}>{phraseScore.phrase.name}</Link>
          {' - '}
          {Math.round(phraseScore.percent_correct * 100)}% correct
        </div>
      })
    }
  </>
}

