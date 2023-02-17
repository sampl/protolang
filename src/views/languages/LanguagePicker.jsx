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
      return <Link key={lang.id} to={`/${lang.id}`} style={{border: '1px solid', padding: '1rem 2rem', display: 'inline-block', textDecoration: 'none'}}>
        {lang.name_en}{lang.is_beta && ' (beta)'} →
      </Link>
    })}

    <br />
    <br />

    <p>Coming soon...</p>

    {soonLanguages?.map( (lang, index) => {
      return <span key={lang.id}>
        {index > 0 && ' · '}
        <Link to={`/${lang.id}`}>
          {lang.name_en}
        </Link>
      </span>
    })}

  </>
}
