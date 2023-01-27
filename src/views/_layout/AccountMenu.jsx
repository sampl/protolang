import { Link } from 'react-router-dom'

import { useUser } from '@/_state/user'

export default () => {
  const { user } = useUser()

  return <>
    <Link to="/feedback">Feedback</Link>
    <div style={{width: '1rem', display: 'inline-block'}} />
    {
      user ?
      <>
        <Link to="/settings">Account</Link>
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
