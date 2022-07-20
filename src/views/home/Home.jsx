import { useUser } from "../../_state/user"
import AttemptsList from '@/views/home/AttemptsList'
import Heatmap from "./Heatmap"

export default () => {
  const { user } = useUser()
  return <>
    <h2>Welcome, {user?.username}</h2>

    <hr />

    <Heatmap />

    <hr />

    <AttemptsList userId={user.id} />
  </>
}
