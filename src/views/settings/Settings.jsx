import { useState } from 'react'

import { supabase } from '@/_util/supabaseClient'
import { useUser } from '@/_state/user'

export default () => {
  const { user, logout } = useUser()
  const [username, setUsername] = useState(user?.username)
  const [loading, setLoading] = useState(false)

  const onSubmit = async event => {
    event.preventDefault()
    try {
      setLoading(true)
      const user = supabase.auth.user()

      const updates = {
        id: user.id,
        username,
        updated_at: new Date(),
      }

      let { error } = await supabase.from('profiles').upsert(updates, {
        returning: 'minimal', // Don't return the value after inserting
      })

      if (error) {
        throw error
      }
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return <>
    <h1>Settings</h1>

    <form onSubmit={onSubmit}>
      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="text"
        value={user && user.email}
        disabled
      />

      <br/>

      <label htmlFor="username">Username</label>
      <input
        id="username"
        type="text"
        value={username || ''}
        onChange={(e) => setUsername(e.target.value)}
      />

      <br/>

      <button type="submit" disabled={loading}>{loading ? 'Updating...' : 'Update'}</button>
    </form>

    <hr />

    <button onClick={() => logout()}>
      Sign Out
    </button>

  </>
}
