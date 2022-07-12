import Layout from './Layout'
import { useUser } from "./user";
import { useState } from 'react';

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
