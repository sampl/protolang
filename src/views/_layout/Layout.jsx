import { Link } from 'react-router-dom'
import { useState } from 'react'

import { useUser } from '@/_state/user'
import { useLanguage } from '@/_state/language'
import DropdownNavMenu from '@/styles/DropdownNavMenu'
import TopNav from '@/styles/TopNav'
import Modal from '@/styles/Modal'
import NewUserLanguage from '@/views/user_languages/NewUserLanguage'

export default ({children}) => {
  const { user } = useUser()
  const [ isAddingLanguage, setIsAddingLanguage ] = useState(false)
  const { currentLanguage, userLanguages, setCurrentLanguageId } = useLanguage()

  return <div>

    {isAddingLanguage &&
      <Modal close={() => setIsAddingLanguage(false)}>
        <NewUserLanguage closeModal={() => setIsAddingLanguage(false)} />
      </Modal>
    }

    <TopNav>
      <nav>
        <a href="/">Home</a>
        {' '}
        <Link to="/lessons">Lessons</Link>
        {' '}
        <Link to="/practice">Practice</Link>
        {' '}
        <Link to="/resources">Resources</Link>
      </nav>
      <div>
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
          <button onClick={() => setIsAddingLanguage(true)}>+ Learn another language</button>
        </DropdownNavMenu>
        {' '}
        {!user ? <Link to="/login">Log in</Link> : <Link to="/settings">Settings</Link>}
      </div>
    </TopNav>
    
    <hr />

    <main>
      {children}
    </main>

  </div>
}