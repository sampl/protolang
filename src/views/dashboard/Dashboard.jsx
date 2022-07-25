import { useUser } from "../../_state/user"
import Heatmap from "./Heatmap"
import UserScore from "./UserScore"
import Radio from "./Radio"
import { TwoColumns } from "@/styles/Layout"
import ProblemWords from "./ProblemWords"

export default () => {
  const { user } = useUser()
  return <>
    <h2>Welcome, {user?.username}</h2>

    <TwoColumns cols="2fr 1fr">
      <div>
        <UserScore />
        <Heatmap />
        <ProblemWords />
      </div>
      <div>
        <Radio />
      </div>
    </TwoColumns>
  </>
}
