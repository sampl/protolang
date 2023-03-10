import { OneCol } from "@/styles/Layout"
import { Link } from "react-router-dom"

export default () => {
  return <OneCol>

    <h1>About this site</h1>

    <p>
      Protolang is a free, open-source language learning website, similar to Duolingo or Rosetta Stone.
      The goal is to help language learners get to proficiency as fast as possible.
    </p>

    <p>We believe that:</p>

    <ul>
      <li>
        The world would be a better place if cultures could communicate with each other
      </li>
      <li>
        Learning new things online should be free
      </li>
      <li>
        Digital, self-directed learning tools are key to the future of education
      </li>
      {/* <li>
        Small teams of passionate people can build amazing things
      </li> */}
      <li>
        We should preserve the world's languages for future generations
      </li>
    </ul>

  </OneCol>
}
