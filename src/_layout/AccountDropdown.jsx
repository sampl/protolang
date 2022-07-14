import { Link } from 'react-router-dom'

import { useUser } from '@/_state/user'
import { useLanguage } from '@/_state/language'
import DropdownNavMenu from '@/styles/DropdownNavMenu'

export default function AccountDropdown() {

  const { user } = useUser()
  const { currentLanguage, userLanguages, setCurrentLanguageId } = useLanguage()

  return <div>
    <DropdownNavMenu trigger={currentLanguage?.language?.flag}>
      {userLanguages && userLanguages.map( userLanguage => {
        const { id, name_en } = userLanguage.language
        return <div
          key={userLanguage.id}
          onClick={() => setCurrentLanguageId(id)}
        >
          {name_en}
        </div>
      })}
    </DropdownNavMenu>

    {!user ? <Link to="/login">log in</Link> : <Link to="/account">Account</Link>}
  </div>
}
