import { useUser } from "../../_state/user"
import AttemptsList from '@/views/dashboard/AttemptsList'
import Heatmap from "./Heatmap"
import UserScore from "./UserScore"

export default () => {
  const { user } = useUser()
  return <>
    <h2>Welcome, {user?.username}</h2>

    <hr />

    <Heatmap />
    <UserScore />
    
    <hr />

    <AttemptsList userId={user.id} />
  </>
}
