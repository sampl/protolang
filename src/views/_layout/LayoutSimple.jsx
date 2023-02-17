import {Link} from 'react-router-dom'

import AccountMenu from '@/views/_layout/AccountMenu'
import Footer from '@/views/_layout/Footer'
import { HeaderFooterLayoutWrapper, Header, Main } from '@/styles/Layout'
import Logo from './Logo'
import UserLanguageDropdown from './UserLanguageDropdown'
import { useUser } from "@/_state/user"
import { useLanguage } from '@/_state/language'

export default ({children}) => {
  const { isAdmin } = useUser()
  const { currentLanguage } = useLanguage()

  return <HeaderFooterLayoutWrapper>

    <Header>
      <nav>
        <Logo to="/" />
      </nav>
      <div>
        {isAdmin && <Link to={`/${currentLanguage.id || 'it'}/admin`}>Admin</Link>}
        <UserLanguageDropdown />
        <AccountMenu />
      </div>
    </Header>

    <Main>
      {children}
    </Main>

    <Footer />

  </HeaderFooterLayoutWrapper>
}
