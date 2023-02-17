// import { Link } from 'react-router-dom'

import { supabase, useSupabaseQuery } from '@/db/supabase'

export default () => {

  const query = supabase
    .from('users')
    .select()
  const [users, loading, error] = useSupabaseQuery(query)

  if (error) return <div>error: {error.message}</div>
  if (loading) return <div>loading...</div>
  if (!users || users.length <= 0) return <div>TODO - debug query and show users</div>

  return <>
    <h1>Users</h1>
    {users.length} user{users.length === 1 ? '' : 's'}

    <hr />

    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Created at</th>
          <th>Last updated</th>
        </tr>
      </thead>
      <tbody>
        {
          users.map(user => {
            return <tr key={user.id}>
              <td>
                {user.id}
              </td>
              <td>
                {user.name}
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
