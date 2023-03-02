import { supabase, useSupabaseQuery } from '@/db/supabase'
import { Link } from 'react-router-dom'

export default () => {

  const query = supabase
    .from('languages')
    .select()
  const [languages, loading, error] = useSupabaseQuery(query)

  const liveLanguages = languages?.filter(l => l.is_live)
  const soonLanguages = languages?.filter(l => !l.is_live)

  if (loading) return 'loading...'
  if (error) return error.message

  return <>
    <h2>Choose a language</h2>

    {liveLanguages?.map(lang => {
      return <Link key={lang.id} to={`/${lang.id}`} className="button" style={{padding: '1rem 2rem'}}>
        {lang.name_eng}{lang.is_beta && ' (beta)'} →
      </Link>
    })}

    <br />
    <br />

    <p>Coming soon...</p>

    {soonLanguages?.map( (lang, index) => {
      return <span key={lang.id}>
        {index > 0 && ' · '}
        <Link to={`/${lang.id}`}>
          {lang.name_eng}
        </Link>
      </span>
    })}

  </>
}
