import { Link } from 'react-router-dom'

import AccountDropdown from '@/_layout/AccountDropdown'
import TopNav from '@/styles/TopNav'

export default ({children}) => {
  return <div>
    <TopNav>
      <nav>
        <a href="/">Home</a>
        <Link to="/lessons">Lessons</Link>
        <Link to="/practice">Practice</Link>
        <Link to="/resources">Resources</Link>
      </nav>
      <AccountDropdown />
    </TopNav>
    <hr />
    <main>
      {children}
    </main>
  </div>
}
