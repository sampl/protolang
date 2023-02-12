import { useState } from 'react'

import { supabase } from '@/db/supabase'
import { useUser } from '@/_state/user'

export default () => {
  const { user } = useUser()
  const [username, setUsername] = useState(user?.username)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)

  const onSubmit = async event => {
    event.preventDefault()
    try {
      setLoading(true)
      const updates = {
        id: user.id,
        username,
      }

      // TODO - don't upsert, add another trigger and make sure there is
      // an actual profile and user for every auth account
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
      setIsEditing(false)
    }
  }

  return <>
    <form onSubmit={onSubmit}>
      <label htmlFor="username">Username</label>
      {
        !isEditing ?
        <>
          {username || '[None set]'}
          {' - '}
          <button onClick={event => {
            event.preventDefault()
            setIsEditing(true)
          }}>
            edit
          </button>
        </>
        :
        <>
          <input
            id="username"
            type="text"
            value={username || ''}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button type="submit" disabled={loading}>{loading ? 'Updating...' : 'Update'}</button>
        </>
      }
    </form>
  </>
}
