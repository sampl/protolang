import { Link } from 'react-router-dom'

import { useUser } from '@/_state/user'

export default () => {
  const { user } = useUser()

  return <>
    {
      user ?
      <>
        <Link to="/settings">👤</Link>
      </>
      :
      <>
        <Link to="/signup">Create account</Link>
        {' / '}
        <Link to="/login">Log in</Link>
      </>
    }
  </>
}
