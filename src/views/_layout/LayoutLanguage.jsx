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
          <>
            <h2>The {currentLanguage?.name_en} language course isn't ready yet</h2>
            {
              !user ?
              <p>
                <Link to="/signup">Create an account</Link>
                {' '}
                to get notified about new courses
              </p>
              :
              <p>
                {/* TODO - let people request a course here */}
              </p>
            }
            <p>
              Do you know {currentLanguage?.name_en}? Why not
              {' '}
              <Link to="/contribute">help us write the course</Link>?
            </p>
          </>
          :
        children
      }
    </Main>

    <Footer />

  </HeaderFooterLayoutWrapper>
}
