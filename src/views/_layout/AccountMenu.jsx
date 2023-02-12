import { Link } from 'react-router-dom'

import { useUser } from '@/_state/user'
import FeedbackForm from '../account/FeedbackForm'

export default () => {
  const { user } = useUser()

  return <>
    <FeedbackForm />

    {
      user?.id ?
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
