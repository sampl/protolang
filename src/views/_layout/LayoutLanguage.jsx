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
import ErrorPage from '../ErrorPage'
import LayoutSimple from './LayoutSimple'
import Signup from '../account/Signup'

export default ({children}) => {
  const { currentLanguage, userLanguages, fetching, error, setCurrentLanguageId } = useLanguage()
  const { lang: urlLang } = useParams()
  const { user, isBetaUser } = useUser()
  const navigate = useNavigate()

  useEffect( () => setCurrentLanguageId(`lang_${urlLang}`), [urlLang])

  // somehow we got a bad link and undefined ended up in the url bar as a string
  if (urlLang === 'undefined') {
    navigate('/')
  }

  // TODO - better conditions for loading etc
  if (!currentLanguage) {
    return <LayoutSimple>
      <ErrorPage />
    </LayoutSimple>
  }

  if (!isBetaUser && user) {
    return <LayoutSimple>
      Coming soon!
    </LayoutSimple>
  }

  if (!isBetaUser && !user) {
    return <LayoutSimple>
      <h1>Coming soon!</h1>
      <p>Sign up to get notified when Protolang launches</p>
      <br />
      <br />
      <Signup />
    </LayoutSimple>
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
