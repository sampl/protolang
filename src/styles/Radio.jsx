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

  &::before {
    content: '';
    width: 10px;
    height: 10px;
    display: block;
    border: 1px solid black;
    position: absolute;
    top: 5px;
    left: 0;
    box-shadow: inset 0 0 0 2px #eee;
    border-radius: 100px;

    background: #ccc;

  }
  &[data-state="checked"]::before {
    background: black;
  }
`
