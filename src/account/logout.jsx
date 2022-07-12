import { useEffect } from 'react'

import Layout from '@/_layout/Layout'
import { useUser } from '@/_state/user'

export default function Logout() {
  const { logout } = useUser()

  useEffect( () => {
    logout()
  }, [])

  return <Layout>
    logging out...
  </Layout>
}
