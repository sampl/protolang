import { Link, NavLink } from 'react-router-dom'

import { useLanguage } from '@/_state/language'
import DropdownNavMenu from '@/styles/DropdownNavMenu'
import TopNav from '@/styles/TopNav'
import AccountMenu from '@/views/_layout/AccountMenu'
import Footer from '@/views/_layout/Footer'
import { HeaderFooterLayoutWrapper } from '@/styles/Layout'

export default ({children}) => {
  const { currentLanguage, userLanguages } = useLanguage()

  return <HeaderFooterLayoutWrapper>

    <TopNav>
      <nav>
        <NavLink to={`/`}>Protolang</NavLink>
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
          <Link to={`/languages`}>+ Learn another language</Link>
        </DropdownNavMenu>}
        {' '}
        <AccountMenu />
      </div>
    </TopNav>

    <main>
      {children}
    </main>

    <Footer />

  </HeaderFooterLayoutWrapper>
}
