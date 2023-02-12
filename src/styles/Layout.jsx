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
  margin: 0 0 1rem;

  & > * {
    display: flex;
    align-items: center;
    gap: .5rem;
  }
`
export const Main = styled.main`
  padding: var(--leading) var(--gutter);
`
export const Footer = styled.footer`
  padding: 4rem var(--gutter) var(--leading) var(--gutter);
`

// section layouts
export const OneCol = styled.div`
  max-width: 50rem;
  /* margin: 0 auto; */
`
export const TwoColumns = styled.div`
  display: grid;
  grid-template-columns: ${p => p.cols || `1fr 1fr`};
  grid-column-gap: ${p => p.gap ? `${p.gap}rem` : `2rem`};

  @media (max-width: 800px) {
    grid-template-columns: auto;
  }
`
