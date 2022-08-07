import { Link, NavLink, useNavigate, useParams } from 'react-router-dom'

import { useLanguage } from '@/_state/language'
import DropdownNavMenu from '@/styles/DropdownNavMenu'
import AccountMenu from '@/views/_layout/AccountMenu'
import Footer from '@/views/_layout/Footer'
import { HeaderFooterLayoutWrapper, Header, Main } from '@/styles/Layout'
import LanguagePicker from '../user_languages/LanguagePicker'
import { useUser } from "@/_state/user"
import { useEffect } from 'react'
import Banner from '@/styles/Banner'
import UserLanguageOnboarding from '../user_languages/UserLanguageOnboarding'

export default ({children}) => {
  const { currentLanguage, userLanguages, fetching, error, setCurrentLanguageId } = useLanguage()
  const { lang: urlLang } = useParams()
  const { user } = useUser()
  const navigate = useNavigate()

  useEffect( () => setCurrentLanguageId(`lang_${urlLang}`), [urlLang])

  // somehow we got a bad link and undefined ended up in the url bar as a string
  if (urlLang === 'undefined') {
    navigate('/')
  }

  return <HeaderFooterLayoutWrapper>

    <Header>
      <nav>
        <NavLink to={`/${urlLang}`}>Protolang</NavLink>
        {' '}
        <NavLink to={`/${urlLang}/lessons`}>Lessons</NavLink>
        {' '}
        <NavLink to={`/${urlLang}/practice`}>Practice</NavLink>
        {' '}
        <NavLink to={`/${urlLang}/resources`}>Resources</NavLink>
      </nav>
      <div>
        <DropdownNavMenu trigger={currentLanguage?.flag}>
          {userLanguages?.map( userLanguage => {
            const { id, code, name_en } = userLanguage
            return <div key={id}>
              <Link to={`/${code}`}>
                {name_en}
              </Link>
            </div>
          })}
          <Link to={`/languages`}>+ Learn another language</Link>
        </DropdownNavMenu>
        {' '}
        <AccountMenu />
      </div>
    </Header>

    {/*
      TODO
      How should URLs interact with current language?
      ie should every page that requires a language check the route and try to set it if they find one?
    */}
    <Main>

      {!user && <Banner>
          To start saving your progress, <Link to="/signup">create an account</Link>.
        </Banner>
      }

      {
        fetching ?
          'Loading...' :
        error ?
          error.message : 
        !urlLang ?
          <LanguagePicker /> :
        (user && !userLanguages?.map(ul => ul?.id).includes(currentLanguage?.id)) ?
          <UserLanguageOnboarding /> :
        !currentLanguage ?
          `no language, loading...` :
        !currentLanguage.is_live ?
          `${currentLanguage?.name_en} lessons coming soon! Create an account to get notified of new courses.` :
        children
      }
    </Main>

    <Footer />

  </HeaderFooterLayoutWrapper>
}
