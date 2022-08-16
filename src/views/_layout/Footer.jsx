import { Link } from 'react-router-dom'

import { Footer } from '@/styles/Layout'

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
      <Link to="/">Home</Link>
      {' · '}
      <Link to="/about">About</Link>
      {' · '}
      <a href="https://github.com/sampl/language-learning/blob/main/license.txt">License</a>
      {' · '}
      <a href="https://github.com/sampl/language-learning">Source</a>
      {' · '}
      <Link to="/contribute">Contribute</Link>
      {' · '}
      <Link to="/sponsor">Sponsor</Link>
      {' · '}
      <Link to="/contact">Contact</Link>
    </p>

    <p style={{fontSize: 'var(--s)'}}>
      &copy; 2022{new Date().getFullYear()>2022 && ("-"+new Date().getFullYear())} Directed Works LLC
      {' · '}
      <span onClick={toggleBetaAccess}>Beta access</span>
      {' · '}
      <Link to="/legal">Legal</Link>
    </p>
  </Footer>
}
