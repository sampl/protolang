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
import SearchBox from './SearchBox'
import Signup from '../account/Signup'
import Logo from './Logo'
import UserLanguageDropdown from './UserLanguageDropdown'

export default ({children}) => {
  const { currentLanguage, userLanguages, loading, error, setCurrentLanguageId } = useLanguage()
  const { langId } = useParams()
  const { user, isBetaUser } = useUser()
  const navigate = useNavigate()

  useEffect( () => setCurrentLanguageId(langId), [langId])

  if (!langId) {
    return <LayoutSimple>
      <LanguagePicker />
    </LayoutSimple>
  }
  // somehow we got a bad link and undefined ended up in the url bar as a string
  if (langId === 'undefined') {
    navigate('/')
  }
  if (error) {
    console.error(error.message)
    return <LayoutSimple>
      <ErrorPage />
    </LayoutSimple>
  }
  if (loading || !currentLanguage) {
    return <LayoutSimple>
      Loading...
    </LayoutSimple>
  }
  if (!currentLanguage.is_live) {
    return <LayoutSimple>
      <h2>The {currentLanguage?.name_en} language course isn't ready yet</h2>
      {
        !user ?
        <p>
          <Link to="/signup">Create an account</Link>
          {' '}
          to get notified about new courses.
        </p>
        :
        <p>
          {/* TODO - let people request a course here */}
        </p>
      }
      <p>
        Do you know {currentLanguage?.name_en}?
        {' '}
        <Link to="/contribute">Help us write the course</Link>!
      </p>
    </LayoutSimple>
  }
  if (!isBetaUser) {
    return <LayoutSimple>
      <h1>Coming soon!</h1>
      {user ?
        <p>Stay tuned—we'll email you when this language is available</p>
      :
        <>
          <p>Sign up to get notified when Protolang launches</p>
          <br />
          <br />
          <Signup />
        </>
      }
    </LayoutSimple>
  }

  if (user && !userLanguages?.map(ul => ul.language?.id).includes(langId)) {
    return <LayoutSimple>
      <UserLanguageOnboarding />
    </LayoutSimple>    
  }

  return <HeaderFooterLayoutWrapper>

    <Header>
      <nav>
        <Logo to={`/${langId}`} />
        <NavLink to={`/${langId}/lessons`}>Lessons</NavLink>
        <NavLink to={`/${langId}/practice`}>Practice</NavLink>
        <DropdownNavMenu trigger="More...">
          <NavLink to={`/${langId}/resources`}>Resources</NavLink>
          <br />
          <NavLink to={`/${langId}/media`}>Media</NavLink>
          <br />
          <NavLink to={`/${langId}/dictionary`}>Dictionary (coming soon)</NavLink>
          <br />
          <div>Chat (coming soon)</div>
          <div>Community (coming soon)</div>
        </DropdownNavMenu>
      </nav>
      <div>
        <SearchBox />
        <UserLanguageDropdown />
        <AccountMenu />
      </div>
    </Header>

    <Main>
      {!user && <Banner>
          To start saving your progress, <Link to="/signup">create an account</Link>.
        </Banner>
      }
      {children}
    </Main>

    <Footer />

  </HeaderFooterLayoutWrapper>
}
