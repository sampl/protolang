import { useUser } from '@/_state/user'
import UserName from '@/views/settings/UserName'

export default () => {
  const { user, logout } = useUser()

  return <>
    <h1>Account settings</h1>

    <form>
      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="text"
        value={user && user.email}
        disabled
      />
    </form>

    <UserName />

    <hr />

    <button onClick={() => logout()}>
      Sign Out
    </button>

  </>
}
