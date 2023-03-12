import { Link } from 'react-router-dom'

import { supabase, useSupabaseQuery } from '@/db/supabase'

export default () => {

  const query = supabase
    .from('user_profiles')
    .select()
  const [userProfiles, loading, error] = useSupabaseQuery(query)

  if (error) return <div>error: {error.message}</div>
  if (loading) return <div>loading...</div>
  if (!userProfiles || userProfiles.length <= 0) return <div>TODO - debug query and show users</div>

  return <>
    <h1>Users</h1>
    {userProfiles.length} user{userProfiles.length === 1 ? '' : 's'}

    <hr />

    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Username</th>
          <th>Created at</th>
          <th>Last updated</th>
        </tr>
      </thead>
      <tbody>
        {
          userProfiles.map(user => {
            return <tr key={user.id}>
              <td>
                {user.id}
              </td>
              <td>
                { user.username ?
                  <Link to={`/u/${user.username}`}>{user.username}</Link> :
                  '❌ no username'
                }
              </td>
              <td>
                {new Intl.DateTimeFormat('en-US').format(new Date(user.created_at))}
              </td>
              <td>
                {new Intl.DateTimeFormat('en-US').format(new Date(user.updated_at))}
              </td>
            </tr>
          })
        }
      </tbody>
    </table>

  </>
}
