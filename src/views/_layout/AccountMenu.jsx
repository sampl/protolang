import { Link, useParams } from 'react-router-dom'

import { useUser } from '@/_state/user'
import FeedbackForm from '../account/FeedbackForm'
import DropdownNavMenu from '@/styles/DropdownNavMenu'

export default () => {
  const { user, logout } = useUser()
  const { langId } = useParams()

  return <>
    <FeedbackForm />

    {
      user?.id ?
      <DropdownNavMenu trigger="Account" align="end">
        {langId && <Link to={`/${langId}/profile`}>Profile</Link>}
        <br />
        <Link to={`/settings`}>Settings</Link>
        <br />
        <button onClick={() => logout()}>Log out</button>
      </DropdownNavMenu>
      :
      <>
        <Link to="/signup">Create account</Link>
        {' / '}
        <Link to="/login">Log in</Link>
      </>
    }
  </>
}
