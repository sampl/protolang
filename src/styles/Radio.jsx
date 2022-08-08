import styled from 'styled-components/macro'
import * as Radio from '@radix-ui/react-radio-group'

export const RadioRoot = Radio.Root

export const RadioItem = styled(Radio.Item)`
  border: 1.5px solid;
  cursor: pointer;
`
export const RadioIndicator = styled(Radio.Indicator)`
  width: 10px;
  height: 10px;
  display: block;

  &[data-state="checked"] {
    background: black;
  }
`
