import { useLanguage } from '@/_state/language'
import { Link } from 'react-router-dom'

export default () => {
  const { languages } = useLanguage()

  const liveLanguages = languages?.filter(l => l.is_live)
  const soonLanguages = languages?.filter(l => !l.is_live)

  return <>
    <h2>Choose a language</h2>

    {liveLanguages?.map(lang => {
      return <Link key={lang.id} to={`/${lang.code}`} style={{border: '1px solid', padding: '1rem 2rem', display: 'inline-block', textDecoration: 'none'}}>
        {lang.name_en} →
      </Link>
    })}

    <br />
    <br />

    <p>Coming soon...</p>

    {soonLanguages?.map( (lang, index) => {
      return <span key={lang.id}>
        {index > 0 && ' · '}
        <Link to={`/${lang.code}`}>
          {lang.name_en}
        </Link>
      </span>
    })}

  </>
}
