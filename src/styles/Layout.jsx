import styled from 'styled-components/macro'

// header/footer layout
export const HeaderFooterLayoutWrapper = styled.div`
  display: grid;
  grid-template-rows: max-content auto max-content;
  height: 100vh;
`
export const Header = styled.header`
  display: grid;
  grid-template-columns: auto max-content;
  padding: var(--leading) var(--gutter);
  border-bottom: 1px solid;
`
export const Main = styled.main`
  padding: var(--leading) var(--gutter);
`
export const Footer = styled.footer`
  padding: 4rem var(--gutter) var(--leading) var(--gutter);
`

// section layouts
export const TwoColumns = styled.div`
  display: grid;
  grid-template-columns: ${p => p.cols || `1fr 1fr`};
  grid-column-gap: ${p => p.gap ? `${p.gap}rem` : `2rem`};

  @media (max-width: 800px) {
    grid-template-columns: auto;
  }
`
