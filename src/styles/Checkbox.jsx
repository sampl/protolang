import styled from 'styled-components/macro'
import * as Checkbox from '@radix-ui/react-checkbox'

export const CheckboxWrapper = ({ children, ...props }) => {
  return <>
    <CheckboxBox {...props} />
    {children}
  </>
}

const CheckboxBox = styled(Checkbox.Root)`
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
    border-radius: 0px;

    background: #ccc;

  }
  &[data-state="checked"]::before {
    background: black;
  }
`
