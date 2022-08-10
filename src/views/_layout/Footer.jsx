import { Link } from 'react-router-dom'

import { Footer } from '@/styles/Layout'

export default () => {
  return <Footer>
    <p style={{color: 'red', fontWeight: 'bold'}}>This site is in early alpha testing. Your progress may not be saved. Use at your own risk.</p>
    <p>
      {/* <Link to="/">Home</Link>
      {' · '} */}
      <Link to="/about">About</Link>
      {' · '}
      <a href="https://github.com/sampl/protolang" target="_blank">Source</a>
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
      <Link to="/legal">Legal</Link>
    </p>
  </Footer>
}
