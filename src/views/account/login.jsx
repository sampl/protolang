import { useState } from 'react'

import { useUser } from '@/_state/user'
import { Navigate } from 'react-router-dom'

export default () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const { user, login } = useUser()

  const onSubmit = async event => {
    event.preventDefault()
    try {
      setLoading(true)
      login(email)
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (user) {
    return <Navigate to="/dashboard" />
  }

  return <>
    <h1>Log in</h1>
    <form onSubmit={onSubmit}>
      <input
        type="email"
        placeholder="Your email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <button disabled={loading} type="submit">{loading ? "Logging in..." : "Log in"}</button>
    </form>
  </>
}
