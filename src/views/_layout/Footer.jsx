import { Footer } from '@/styles/Layout'
import { Link } from '@/styles/Links'

export default () => {

  const toggleBetaAccess = () => {
    const isBetaUser = !!localStorage.getItem('protolang_is_beta_user')
    if (isBetaUser) {
      localStorage.removeItem('protolang_is_beta_user')
      window.alert('Beta access removed')
      location.reload()
      return
    }
    if (window.prompt(`Welcome to Protolang beta access! What's the secret word?`) == 'kingfish') {
      localStorage.setItem('protolang_is_beta_user', true)
      window.alert('Beta access granted!')
      location.reload()
    } else {
      window.alert('Sorry, try again')
    }
  }

  return <Footer>
    <p style={{color: 'red', fontWeight: 'bold'}}>This site is in early alpha testing. Your progress may not be saved. Use at your own risk.</p>
    <p>
      {/* <Link to="/">Home</Link>
      {' · '} */}
      <Link to="/about">About</Link>
      {' · '}
      <Link to="/open-source">Open source</Link>
      {' · '}
      <Link to="/contribute">Contribute</Link>
      {' · '}
      <Link to="/sponsor">Sponsor</Link>
      {' · '}
      <Link to="/contact">Contact</Link>
    </p>

    <p style={{fontSize: 'var(--s)'}}>
      &copy; 2022{new Date().getFullYear()>2022 && ("-"+new Date().getFullYear())}
      {' '}
      <Link $plain as="a" href="https://directedworks.com/" target="_blank">Directed Works LLC</Link>
      {' · '}
      <Link $plain as="span" onClick={toggleBetaAccess}>Beta access</Link>
      {' · '}
      <Link $plain to="/conduct">Code of Conduct</Link>
      {' · '}
      <Link $plain to="/legal">Legal</Link>
    </p>
  </Footer>
}
