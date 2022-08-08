import styled from 'styled-components/macro'

export const HeatmapWrapper = styled.div`
  position: relative;
  border: 1.5px solid;
  display: grid;
  grid-auto-flow: column;
  grid-template-rows: repeat(7, max-content);
  grid-gap: ${p => p.padding ? `${p.padding}px` : `5px`};
  padding:  ${p => p.padding ? `${p.padding}px` : `5px`};
  justify-content: start;
  width: fit-content;
`
export const HeatmapCell = styled.div`
  width:  ${p => p.size ? `${p.size}px` : `5px`};
  height: ${p => p.size ? `${p.size}px` : `5px`};
  border: 1.5px solid;
  background: ${p => p.background || 'white'};
`
export const HeatmapEmptyStateWrapper = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;

  display: grid;
  align-content: center;
  justify-content: center;
`
export const HeatmapEmptyStateMessage = styled.div`
  border: 1.5px solid;
  background: white;
  padding: .25rem .5rem;
`