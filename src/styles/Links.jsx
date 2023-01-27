import { Link as RouterLink } from 'react-router-dom'
import styled from 'styled-components/macro'

export const Link = styled(RouterLink)`
  color: inherit;
  cursor: pointer;
  font-size: inherit;
  text-decoration: ${p => p.$plain ? 'none' : 'underline'};

  &:hover {
    text-decoration: underline;
  }
`
