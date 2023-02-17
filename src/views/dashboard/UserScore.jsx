import { Link } from 'react-router-dom'

import { supabase, useSupabaseQuery } from '@/db/supabase'
import { useUser } from "@/_state/user"
import { useLanguage } from '@/_state/language'

export default () => {

  const { user } = useUser()
  const { currentLanguage } = useLanguage()

  const query = supabase
    .from('user_scores')
    .select()
    .eq('created_by', user?.id)
  const [data, loading, error] = useSupabaseQuery(query, [user?.id], !user)

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
      loading ? 'loading...' :
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
