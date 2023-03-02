import { useState } from 'react'

import { supabase } from '@/db/supabase'
import { useUser } from '@/_state/user'
import { logError } from '../../_util/error.js'

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
        created_by: user.id,
        username,
      }

      // TODO - don't upsert, add another trigger and make sure there is
      // an actual profile and user for every auth account
      const { error } = await supabase
        .from('profiles')
        .upsert(updates, {
          returning: 'minimal', // Don't return the value after inserting
        })

      if (error) {
        throw error
      }
    } catch (error) {
      logError('update username', error)
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
          <button className="button" type="submit" disabled={loading}>{loading ? 'Updating...' : 'Update'}</button>
        </>
      }
    </form>
  </>
}
