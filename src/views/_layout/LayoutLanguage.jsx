import { Link, NavLink, useParams } from 'react-router-dom'
import styled from 'styled-components/macro'

import { useReferencePanel } from '@/_state/reference'
import { useLanguage } from '@/_state/language'
import AccountMenu from '@/views/_layout/AccountMenu'
import Footer from '@/views/_layout/Footer'
import { HeaderFooterLayoutWrapper, Header, Main } from '@/styles/Layout'
import LanguagePicker from '../languages/LanguagePicker'
import { useUser } from "@/_state/user"
import { useEffect } from 'react'
import Banner from '@/styles/Banner'
import UserOnboarding from '../onboarding/UserOnboarding'
import UserLanguageOnboarding from '../onboarding/UserLanguageOnboarding'
import ErrorPage from '../ErrorPage'
import LayoutSimple from './LayoutSimple'
import ReferencePanel from './ReferencePanel'
import Signup from '../account/Signup'
import Logo from './Logo'
import UserLanguageDropdown from './UserLanguageDropdown'
import LanguageVote from '../languages/LanguageVote'

export default ({children}) => {
  const { currentLanguage, userLanguages, loading, error, setCurrentLanguageId } = useLanguage()
  const { langId } = useParams()
  const { user, isBetaUser, isAdmin } = useUser()
  const { referenceIsOpen } = useReferencePanel()

  useEffect( () => setCurrentLanguageId(langId), [langId])

  if (!langId) {
    return <LayoutSimple>
      <LanguagePicker />
    </LayoutSimple>
  }
  // somehow we got a bad link and undefined ended up in the url bar as a string
  if (langId === 'undefined') {
    return <LayoutSimple>
      <LanguagePicker />
    </LayoutSimple>
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
      <h2>The {currentLanguage?.name_eng} language course isn't ready yet</h2>
      {
        !user ?
        <p>
          <Link to="/signup">Create an account</Link>
          {' '}
          to vote on new courses.
        </p>
        :
        <p>
          <LanguageVote language={currentLanguage} />
        </p>
      }
      <p>
        Do you know {currentLanguage?.name_eng}?
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

  if (user && !user.preferences) {
    return <LayoutSimple>
      <UserOnboarding />
    </LayoutSimple>
  }

  if (user && !userLanguages?.map(ul => ul.language_id?.id).includes(langId)) {
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
        <NavLink to={`/${langId}/chat`}>Chat</NavLink>
        <NavLink to={`/${langId}/media`}>Media</NavLink>
      </nav>
      <div>
        {isAdmin && <Link to={`/${currentLanguage.id || 'it'}/admin`}>Admin</Link>}
        <UserLanguageDropdown />
        <AccountMenu />
      </div>
    </Header>

    <Main>

      {!user && <Banner>
          <Link to="/signup">Create an account</Link> to save your progress or edit lessons
        </Banner>
      }
      {children}

      <SidebarWrapper open={referenceIsOpen}>
        <ReferencePanel />
      </SidebarWrapper>

    </Main>

    <Footer />

  </HeaderFooterLayoutWrapper>
}

const SidebarWrapper = styled.div`
  position: fixed;
  z-index: 200;
  right: 3rem;
  bottom: 0;
  width: 360px;
  height: ${props => !props.open ? '4rem' : `60vh`};
  transition: height .2s ease-in-out;
`
