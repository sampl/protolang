import styled from 'styled-components/macro'

export const HeatmapWrapper = styled.div`
  border: 1px solid;
  display: grid;
  grid-auto-flow: column;
  grid-template-rows: repeat(7, max-content);
  grid-gap: ${p => p.padding ? `${p.padding}px` : `5px`};
  padding:  ${p => p.padding ? `${p.padding}px` : `5px`};
  justify-content: start;
`
export const HeatmapCell = styled.div`
  width:  ${p => p.size ? `${p.size}px` : `5px`};
  height: ${p => p.size ? `${p.size}px` : `5px`};
  border: 1px solid;
  background: ${p => p.background || 'white'};
`