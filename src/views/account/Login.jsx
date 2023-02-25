import { useState } from 'react'

import { useUser } from '@/_state/user'
import { Link, Navigate } from 'react-router-dom'
import { Button } from '@/styles/Button'
import { logError } from '../../_util/error.js'

export default () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const { user, login } = useUser()

  const onSubmit = async event => {
    event.preventDefault()
    try {
      setLoading(true)
      await login(email)
    } catch (error) {
      logError('log in', error)
    } finally {
      setLoading(false)
    }
  }

  if (user) {
    return <Navigate to="/" />
  }

  return <>
    <h1>Log in</h1>
    <p>We'll send a login link to your email</p>
    <form onSubmit={onSubmit}>
      <input
        type="email"
        placeholder="Your email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <br />
      <Button disabled={loading} type="submit">{loading ? "Logging in..." : "Log in"}</Button>
    </form>
    <p>New around here? <Link to="/signup">Create an account</Link></p>
  </>
}
