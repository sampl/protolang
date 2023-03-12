import { useState } from 'react'

import { supabase } from '@/db/supabase'
import { useUser } from '@/_state/user'
import { logError } from '../../_util/error.js'

export default ({ refreshOnSet }) => {
  const { user } = useUser()
  const [username, setUsername] = useState(user?.username)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)

  const onSubmit = async event => {
    event.preventDefault()
    try {
      setLoading(true)
      const update = {
        username,
      }

      const { error } = await supabase
        .from('user_profiles')
        .update(update)
        .eq('id', user.id)

      if (error) {
        throw error
      } else {
        refreshOnSet && location.reload()
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
