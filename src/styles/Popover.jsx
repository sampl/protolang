import styled from 'styled-components/macro'
import * as Popover from '@radix-ui/react-popover'

export default ({ target, content }) => {
  return <Popover.Root>
    <Popover.Trigger asChild={true}>{target}</Popover.Trigger>
    <Popover.Portal>
      <PopoverContentWrapper>
        <Popover.Arrow />
        {content}
      </PopoverContentWrapper>
    </Popover.Portal>
  </Popover.Root>
}

const PopoverContentWrapper = styled(Popover.Content)`
  z-index: 1;
  position: absolute;
  background: white;
  padding: 1rem;
  border: 1px solid;
  min-width: 20rem;
`