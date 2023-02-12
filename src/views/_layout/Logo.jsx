import { Link } from 'react-router-dom'
import styled from 'styled-components/macro'

export default ({ to }) => {
  return <LogoWrapper to={to || '/'}>Protolang</LogoWrapper>
}

const LogoWrapper = styled(Link)`
  font-weight: bold;
  text-decoration: none;
`
