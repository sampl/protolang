import styled from 'styled-components/macro'
import * as Popover from '@radix-ui/react-popover'

export default ({ trigger, align = "start", children, triggerAsChild }) => {
  return <Popover.Root>
    <Popover.Trigger asChild={triggerAsChild}>{trigger}</Popover.Trigger>
    <DropdownContentWrapper align={align}>
      {/* <Popover.Arrow /> */}
      {/* <Popover.Close>✖️</Popover.Close> */}
      {children}
    </DropdownContentWrapper>
  </Popover.Root>
}

const DropdownContentWrapper = styled(Popover.Content)`
  z-index: 1;
  background: white;
  padding: 1rem;
  border: 1px solid;
`