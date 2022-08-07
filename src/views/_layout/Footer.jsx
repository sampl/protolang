import { Link } from 'react-router-dom'

import { Footer } from '@/styles/Layout'

export default () => {
  return <Footer>
    <div style={{color: 'red', fontWeight: 'bold'}}>This site is in early alpha testing. Your progress may not be saved, use at your own risk.</div>
    <p>
      <Link to="/">Home</Link>
      {' · '}
      <Link to="/about">About</Link>
      {' · '}
      <a href="https://github.com/sampl/language-learning">License</a>
      {' · '}
      <a href="https://github.com/sampl/language-learning">Source</a>
      {' · '}
      <Link to="/contribute">Contribute</Link>
      {' · '}
      <Link to="/sponsor">Sponsor</Link>
      {' · '}
      <a href="mailto:sam@directedworks.com">Contact</a>
    </p>

    <p>
      &copy; 2022{new Date().getFullYear()>2022 && ("-"+new Date().getFullYear())} Directed Works LLC
    </p>
  </Footer>
}
