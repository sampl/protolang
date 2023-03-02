import { useState } from 'react'

import { supabase } from '@/db/supabase'
import { useUser } from '@/_state/user'
import { Link, Navigate } from 'react-router-dom'
import { logError } from '../../_util/error.js'

export default () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const { user, login } = useUser()

  async function signInWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    })
    if (error) {
      logError('log in with Google', error)
    }
  }

  const onSubmit = async event => {
    event.preventDefault()
    try {
      setLoading(true)
      await login(email)
    } catch (error) {
      logError('sign up', error)
    } finally {
      setLoading(false)
    }
  }

  if (user) {
    return <Navigate to="/" />
  }

  return <>
    <h1>Create your account</h1>
    <button className="button" onClick={signInWithGoogle}>Sign up with Google</button>
    <br />
    <br />
    <form onSubmit={onSubmit}>
      <p>Or sign up with email</p>
      <input
        type="email"
        placeholder="Your email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <button className="button" disabled={loading} type="submit">{loading ? "Signing up..." : "Sign up"}</button>
    </form>
    <p>Already have an account? <Link to="/login">Log in</Link></p>
    <p style={{fontSize: 'small'}}>By signing up, you agree to our <Link to="/terms">Terms of Service</Link></p>
  </>
}
