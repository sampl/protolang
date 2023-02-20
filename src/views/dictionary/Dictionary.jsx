import { Link } from 'react-router-dom'

export default () => {
  return <>
    <h1>Coming soon</h1>

    <p>Some test words:</p>
    <Link to="/it/dictionary/ciao">ciao</Link>
    <br />
    <Link to="/it/dictionary/mangiamo">mangiamo</Link>
    <br />
    <Link to="/it/dictionary/latte">latte</Link>
    <br />
    <Link to="/it/dictionary/prosciutto">prosciutto</Link>
    <br />
  </>
}
