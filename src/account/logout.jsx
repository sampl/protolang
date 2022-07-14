import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import Layout from '@/_layout/Layout'
import { useUser } from '@/_state/user'

export default () => {
  const { logout } = useUser()
  let navigate = useNavigate();

  useEffect( () => {
    logout()
    navigate('/', { replace: true })
  }, [])

  return <Layout>
    logging out...
  </Layout>
}
