import { Link } from 'react-router-dom'

import { useUser } from '@/_state/user'

export default () => {
  const { user } = useUser()

  return <>
    {!user ? <Link to="/login">Log in</Link> : <Link to="/settings">👤</Link>}
  </>
}
