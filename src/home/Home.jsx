import { useUser } from "../_state/user"
import AttemptsList from '@/home/AttemptsList'

export default () => {
  const { user } = useUser()
  return <>
    <h2>Welcome, {user?.username}</h2>

    <hr />

    <AttemptsList userId={user.id} />
  </>
}
