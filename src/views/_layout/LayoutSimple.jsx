import AccountMenu from '@/views/_layout/AccountMenu'
import Footer from '@/views/_layout/Footer'
import { HeaderFooterLayoutWrapper, Header, Main } from '@/styles/Layout'
import Logo from './Logo'
import UserLanguageDropdown from './UserLanguageDropdown'

export default ({children}) => {
  return <HeaderFooterLayoutWrapper>

    <Header>
      <nav>
        <Logo to="/" />
      </nav>
      <div>
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
