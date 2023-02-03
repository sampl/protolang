import styled from 'styled-components/macro'
import * as Radio from '@radix-ui/react-radio-group'

export const RadioRoot = Radio.Root

export const RadioItem = styled(Radio.Item)`
  cursor: pointer;
  appearance: none;
  border: none;
  background: none;
  padding: 0 0 0 1rem;
  margin: 0 0 .5rem;
  display: flex;
  position: relative;
  display: block;
  width: 100%;
  text-align: left;
`
export const RadioIndicator = styled(Radio.Indicator)`
  width: 10px;
  height: 10px;
  display: block;
  background: #ccc;
  border: 1px solid black;
  position: absolute;
  top: 5px;
  left: 0;

  &[data-state="checked"] {
    content: '✔️';
    background: black;
  }
`
