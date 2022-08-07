import { Link } from "react-router-dom"

export default () => {
  return <>

    <h1>About this site</h1>

    <p>
      This site is a free, open-source language learning tool, similar to Duolingo or Rosetta Stone. My goal is to help language learners get proficiency in new languages as fast as possible.
    </p>

    <p>
      <em>
        More coming soon...
      </em>
    </p>

    <Link to="/contact">Contact</Link>

  </>
}
