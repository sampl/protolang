import { Link } from 'react-router-dom'
import styled from 'styled-components/macro'

export const BreadcrumbWrapper = styled.div`
  /* padding: 0 0 1rem; */
`
export const BreadcrumbSeparator = styled.span`
  &:after {
    content: '›';
    display: inline-block;
    text-align: center;
    width: 1rem;
  }
`
export const BreadcrumbItem = styled(Link)`

`
