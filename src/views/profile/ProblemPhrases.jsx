import { useUser } from '@/_state/user'
import { supabase, useSupabaseQuery } from '@/db/supabase'
import { Link, useParams } from 'react-router-dom'

export default () => {

  const { user } = useUser()
  const { langId } = useParams()

  const query = supabase
    .from('user_phrase_scores')
    .select('*, phrase(*)')
    .eq('created_by', user?.id)
    .order('percent_correct', { ascending: true })
    .limit(5)
  const [phraseScores, loading, error] = useSupabaseQuery(query, [user?.id], !user)

  return <>
    <h3>Problem phrases</h3>
    {
      !user ? <>
        <Link to="/signup">Create an account</Link>
        {' '}
        to see the phrases you make the most mistakes on
      </> :
      error ? error.message :
      loading ? 'loading...' :
      (!phraseScores || phraseScores.length <= 0) ? 'no problem phrases!' :
      phraseScores?.map(phraseScore => {
        return <div key={phraseScore.phrase.id}>
          <Link to={`/${langId}/practice/${phraseScore.phrase.id}`}>{phraseScore.phrase.content_ita}</Link>
          {' - '}
          {Math.round(phraseScore.percent_correct * 100)}% correct
        </div>
      })
    }
  </>
}

