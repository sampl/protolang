import { Link, NavLink } from 'react-router-dom'

import { useLanguage } from '@/_state/language'
import DropdownNavMenu from '@/styles/DropdownNavMenu'
import AccountMenu from '@/views/_layout/AccountMenu'
import Footer from '@/views/_layout/Footer'
import { HeaderFooterLayoutWrapper, Header, Main } from '@/styles/Layout'
import Logo from './Logo'

export default ({children}) => {
  const { currentLanguage, userLanguages } = useLanguage()

  return <HeaderFooterLayoutWrapper>

    <Header>
      <nav>
        <Logo to="/" />
      </nav>
      <div>
        {userLanguages?.length > 0 && currentLanguage?.id && <DropdownNavMenu trigger={currentLanguage?.flag}>
          {userLanguages?.map( userLanguage => {
            const { id, code, name_en } = userLanguage
            return <Link
              key={id}
              to={`/${code}`}
            >
              {name_en}
            </Link>
          })}
          <br />
          <Link to={`/languages`}>+ Learn another language</Link>
        </DropdownNavMenu>}
        {' '}
        <AccountMenu />
      </div>
    </Header>

    <Main>
      {children}
    </Main>

    <Footer />

  </HeaderFooterLayoutWrapper>
}
