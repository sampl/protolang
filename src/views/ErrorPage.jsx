import { useNavigate } from "react-router-dom"

export default ({ word }) => {
  const navigate = useNavigate()

  return <>
    <h3>Page not found</h3>
    <p>Sorry, we couldn't find this page</p>
    <hr />
    <p>Think you hit an error?</p>
    <button className="button" onClick={() => navigate('contact')}>Contact us</button>
  </>
}
