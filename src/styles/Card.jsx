import styled from 'styled-components/macro'

export default ({ children }) => {
  return <CardWrapper>{children}</CardWrapper>
}

const CardWrapper = styled.header`
  border: 1px solid;
  padding: 1rem;
  background: white;
`