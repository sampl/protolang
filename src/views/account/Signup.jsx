import { useState } from 'react'

import { useUser } from '@/_state/user'
import { Link, Navigate } from 'react-router-dom'
import { Button } from '@/styles/Button'

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
    return <Navigate to="/" />
  }

  return <>
    <h1>Create your account</h1>
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
    <p>Already have an account? <Link to="/login">Log in</Link></p>
  </>
}
