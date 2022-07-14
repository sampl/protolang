import { useUser } from "./_state/user"

export default () => {
  const { user } = useUser()
  return <h2>Welcome, {user.username}</h2>
}
