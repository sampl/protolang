import styled, { css } from 'styled-components/macro'
import * as Checkbox from '@radix-ui/react-checkbox'
import * as Radio from '@radix-ui/react-radio-group'

// RADIO

export const RadioGroup = ({ options, value, setValue }) => {
  return <RadioRoot
    value={value}
    onValueChange={setValue}
  >
    {options.map( option => {
      return <RadioItem
        key={option.id}
        value={option.id}
      >
        {option.description}
      </RadioItem>
    })}
  </RadioRoot>
}

// CHECKBOX

export const CheckboxItem = ({ groupName, optionId, checked, onChange, children }) => {
  return <CheckboxBoxRoot
    name={groupName}
    value={optionId}
    checked={checked}
    onCheckedChange={checked => onChange(optionId, checked)}
  >
    {children}
  </CheckboxBoxRoot>
}

// https://medium.com/codex/handling-checkboxes-in-react-3a2514b140d2
export const CheckboxGroup = ({ groupName, options, values, setValues }) => {
  const onChange = (optionId, checked) => {
    let newValues = [...values]
    if (checked) {
      newValues = [...newValues, optionId]
      setValues(newValues)
    } else {
      const index = newValues.indexOf(optionId)
      newValues.splice(index, 1)
      setValues(newValues)
    }
  }
  return <CheckboxOptions>
    {options.map( option => {
      return <CheckboxItem
        key={option.id}
        groupName={groupName}
        optionId={option.id}
        checked={values.includes(option.id)}
        onChange={onChange}
      >
        {option.description}
      </CheckboxItem>
    })}
  </CheckboxOptions>
}

// STYLES

const options = css`
  margin: .5rem 0 0 .25rem;
`;
const row = css`
  cursor: pointer;
  appearance: none;
  border: none;
  background: none;
  padding: 0 0 0 1.25rem;
  margin: 0 0 .5rem;
  display: flex;
  position: relative;
  display: block;
  width: 100%;
  text-align: left;
  text-decoration: none;

  // indicator
  &:hover::before {
    background: #999;
  }
`;
const indicator = css`
  content: '';
  width: 10px;
  height: 10px;
  display: block;
  border: 1px solid black;
  position: absolute;
  top: 5px;
  left: 0;
  box-shadow: inset 0 0 0 2px #eee;
  background: #ccc;
`;
const CheckboxOptions = styled.div`
  ${options}
`
const CheckboxBoxRoot = styled(Checkbox.Root)`
  ${row}
  
  &::before {
    ${indicator}
    border-radius: 2px;
  }
  &[data-state="checked"]::before {
    background: black;
  }
`
export const RadioRoot = styled(Radio.Root)`
  ${options}
`
export const RadioItem = styled(Radio.Item)`
  ${row}

  &::before {
    ${indicator}
    border-radius: 100px;
  }
  &[data-state="checked"]::before {
    background: black;
  }
`
