import { Link } from 'react-router-dom'
// import styled from 'styled-components/macro'

import { useLanguage } from '@/_state/language'
import DropdownNavMenu from '@/styles/DropdownNavMenu'

export default () => {
  const { currentLanguage, userLanguages } = useLanguage()

  if (userLanguages?.length < 1 || !currentLanguage?.id) return null

  return <DropdownNavMenu trigger={currentLanguage?.flag || 'Choose language'} align="center">
    {userLanguages?.map( userLanguage => {
      const { id, name_eng } = userLanguage.language_id
      return <Link key={id} to={`/${id}`} style={{display: 'block'}}>{name_eng}</Link>
    })}
    <br />
    <Link to={`/languages`}>Browse all languages...</Link>
  </DropdownNavMenu>
}

// const LogoWrapper = styled(Link)`
//   font-weight: bold;
//   text-decoration: none;
// `
