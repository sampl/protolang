import styled from 'styled-components/macro'

export const TwoColumns = styled.div`
  display: grid;
  grid-template-columns: ${p => p.cols || `1fr 1fr`};
  grid-column-gap: ${p => p.gap ? `${p.gap}rem` : `2rem`};

  @media (max-width: 800px) {
    grid-template-columns: auto;
  }
`
