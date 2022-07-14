import styled from 'styled-components/macro'

export default ({ children }) => {
  return <TopNavWrapper>{children}</TopNavWrapper>
}

const TopNavWrapper = styled.header`
  display: grid;
  grid-template-columns: auto max-content;
`