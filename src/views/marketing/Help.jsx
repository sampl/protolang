import { Link } from "react-router-dom"
import { OneCol } from "@/styles/Layout"

export default () => {
  return <OneCol>
    <h1>Get help</h1>
    <p>Sorry to hear you're having trouble.</p>
    <p>Our full help page is coming soon. For now, <Link to="/contact">contact us directly</Link> if you need support.</p>
  </OneCol>
}
