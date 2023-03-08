import React from 'react'
import styled from 'styled-components/macro'

const OrBar = () => {
  return <OrBarWrapper>
    <OrBarOr>
      or
    </OrBarOr>
  </OrBarWrapper>
}

const OrBarWrapper = styled.div`
  margin: 1rem 0;
  text-align: center;
  position: relative;
  &::after {
    content: '';
    width: 100%;
    height: 1px;
    background: black;
    position: absolute;
    top: 50%;
    left: 0;
  }
`
const OrBarOr = styled.div`
  display: inline-block;
  margin: 0 auto;
  padding: 0 .5rem;
  font-weight: 500;
  font-size: small;
  color: black;
  z-index: 1;
  position: relative;
  background: white;
`

export default OrBar
