import { Footer } from '@/styles/Layout'
import { Link } from '@/styles/Links'

export default () => {

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
      {/* {' · '} */}
      <br />
      <Link $plain to="/conduct">Conduct</Link>
      {' · '}
      <Link $plain to="/privacy">Privacy</Link>
      {' · '}
      <Link $plain to="/terms">Terms</Link>
      {' · '}
      <Link $plain to="/dmca">DMCA</Link>
    </p>
  </Footer>
}
