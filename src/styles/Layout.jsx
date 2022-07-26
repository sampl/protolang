import styled from 'styled-components/macro'

export const HeaderFooterLayoutWrapper = styled.div`
  display: grid;
  grid-template-rows: max-content auto max-content;
  height: 100vh;
`
export const Footer = styled.div`
  padding: 4rem 0 0;
`
export const TwoColumns = styled.div`
  display: grid;
  grid-template-columns: ${p => p.cols || `1fr 1fr`};
  grid-column-gap: ${p => p.gap ? `${p.gap}rem` : `2rem`};

  @media (max-width: 800px) {
    grid-template-columns: auto;
  }
`
