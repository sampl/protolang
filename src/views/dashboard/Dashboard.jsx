import { useUser } from "../../_state/user"
import Heatmap from "./Heatmap"
import Map from "./Map"
import UserScore from "./UserScore"
import Radio from "./Radio"
import Flights from "./Flights"
import { TwoColumns } from "@/styles/Layout"
import ProblemPhrases from "./ProblemPhrases"
import QuickLinks from "./QuickLinks"
import DailyProgress from "@/views/practice/DailyProgress"

export default () => {
  const { user } = useUser()
  return <>

    <h2>
      {user?.username ? `Welcome, ${user.username}` : `Welcome`}
    </h2>

    <QuickLinks />

    <br />

    <TwoColumns cols="2fr 1fr">
      <div>
        <h3>Daily progress</h3>
        <DailyProgress />
        <UserScore />
        <Heatmap />
        <ProblemPhrases />
      </div>
      <div>
        <Map />
        <hr />
        <Flights />
        <hr />
        <Radio />
      </div>
    </TwoColumns>
  </>
}
