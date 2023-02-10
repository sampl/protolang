import { useUser } from "../../_state/user"
import Heatmap from "./Heatmap"
import UserScore from "./UserScore"
import Radio from "./Radio"
import { TwoColumns } from "@/styles/Layout"
import ProblemPhrases from "./ProblemPhrases"
import QuickLinks from "./QuickLinks"

export default () => {
  const { user } = useUser()
  return <>

    <br />

    <h2>
      {user?.username ? `Welcome, ${user.username}` : `Welcome`}
    </h2>

    <QuickLinks />

    <br />

    <TwoColumns cols="2fr 1fr">
      <div>
        <UserScore />
        <Heatmap />
        <ProblemPhrases />
      </div>
      <div>
        <Radio />
      </div>
    </TwoColumns>
  </>
}
