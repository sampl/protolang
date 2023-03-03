import { useState } from 'react'

import { supabase } from '@/db/supabase'
import { useUser } from '@/_state/user'
import { Link, Navigate } from 'react-router-dom'
import { logError } from '../../_util/error.js'
import { CheckboxGroup } from '@/styles/RadioCheckbox.jsx'

export default () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [hasAcknowledgedBeta, setHasAcknowledgedBeta] = useState([])

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
      logError('log in', error)
    } finally {
      setLoading(false)
    }
  }

  if (user) {
    return <Navigate to="/" />
  }

  const disabled = loading || !hasAcknowledgedBeta || hasAcknowledgedBeta.length === 0

  return <>
    <h1>Log in</h1>

    <div style={{
      color: 'red',
      fontWeight: 500,
      padding: '1rem',
      background: 'hsla(0, 80%, 80%, 0.1)',
      maxWidth: '30rem',
      margin: '0 0 1rem 0',
    }}>
      <CheckboxGroup
        groupName="betaWarning"
        values={hasAcknowledgedBeta}
        setValues={setHasAcknowledgedBeta}
        options={[
          {
            id: 'agreed',
            description: <span>I understand my data may not be saved while Protolang is in alpha preview, and that any contributions I make will be open licensed according to our <Link to="/terms">terms of service</Link> and <Link to="/open-source">open source licenses</Link>.</span>,
          },
        ]}
      />
    </div>

    <button
      className="button"
      onClick={signInWithGoogle}
      disabled={disabled}
    >
      Log in with Google
    </button>
    <br />
    <br />
    <form onSubmit={onSubmit}>
      <p>Or login with email</p>
      <input
        type="email"
        placeholder="Your email"
        value={email}
        disabled={disabled}
        onChange={e => setEmail(e.target.value)}
      />
      <button
        className="button"
        disabled={disabled}
        type="submit"
      >
        {loading ? "Logging in..." : "Log in"}
      </button>
    </form>
    <p>New around here? <Link to="/signup">Create an account</Link></p>
    <p style={{fontSize: 'small'}}>By logging in, you agree to our <Link to="/terms">Terms of Service</Link></p>
  </>
}
