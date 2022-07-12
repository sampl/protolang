import { useState } from 'react'

import Layout from '../_layout/Layout'
import { useUser } from '../_state/user'

export default function Login() {
  const [email, setEmail] = useState('')
  const { login } = useUser()

  return <Layout>
    <h1>Log in</h1>
    <input
      type="email"
      placeholder="Your email"
      value={email}
      onChange={e => setEmail(e.target.value)}
    />
    <button
      onClick={e => {
        e.preventDefault()
        login(email)
      }}
    >
      Log in
    </button>
  </Layout>
}
