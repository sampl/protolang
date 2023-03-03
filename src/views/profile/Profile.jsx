import { useUser } from "../../_state/user"
import Heatmap from "./Heatmap"
import Map from "./Map"
import UserScore from "./UserScore"
import Flights from "./Flights"
import { TwoColumns } from "@/styles/Layout"
import ProblemPhrases from "./ProblemPhrases"
import GoalDate from "./GoalDate"
import GoalTopics from "./GoalTopics"
import DailyProgress from "@/views/practice/DailyProgress"

export default () => {
  const { user } = useUser()
  return <>
    <TwoColumns cols="2fr 1fr">
      <div>
        <h2>{user.username}</h2>
        <br />
        <h3>Daily progress</h3>
        <DailyProgress />
        <UserScore />
        <Heatmap />
        <ProblemPhrases />
      </div>
      <div>
        <GoalDate />
        <hr />
        <GoalTopics />
        <hr />
        <Map />
        <hr />
        <Flights />
      </div>
    </TwoColumns>
  </>
}
