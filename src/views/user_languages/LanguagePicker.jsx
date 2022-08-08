import { useLanguage } from '@/_state/language'
import { Link } from 'react-router-dom'

export default () => {
  const { languages } = useLanguage()

  const liveLanguages = languages?.filter(l => l.is_live)
  const soonLanguages = languages?.filter(l => !l.is_live)

  return <>
    <h2>Your adventure starts here</h2>
    <p>In beta</p>

    {liveLanguages?.map(lang => {
      return <div key={lang.id}>
        <Link to={`/${lang.code}`}>
          {lang.name_en}
        </Link>
      </div>
    })}

    <br />

    <p>Coming soon...</p>

    {soonLanguages?.map(lang => {
      return <div key={lang.id}>
        <Link to={`/${lang.code}`}>
          {lang.name_en}
        </Link>
      </div>
    })}

  </>
}
