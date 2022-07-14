import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { useUser } from '@/_state/user'

export default () => {
  const { logout } = useUser()
  let navigate = useNavigate()

  useEffect( () => {
    logout()
    navigate('/', { replace: true })
  }, [])

  return 'logging out...'
}
