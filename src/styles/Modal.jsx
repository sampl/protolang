import styled from 'styled-components/macro'
import * as Dialog from '@radix-ui/react-dialog'

export default ({ close, children }) => {
  return <Dialog.Root open={true}>
    <Dialog.Portal>
      <ModalOverlay onClick={close} />
      <ModalWrapper>
        <ModalContentWrapper>
          <Dialog.Close onClick={close}>✖️</Dialog.Close>
          {/* <Dialog.Title>{title}</Dialog.Title> */}
          {/* <Dialog.Description /> */}
          {children}
        </ModalContentWrapper>
      </ModalWrapper>
    </Dialog.Portal>
  </Dialog.Root>
}

const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`
const ModalOverlay = styled(Dialog.Overlay)`
  background: hsla(0, 0%, 30%, .5);
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`
const ModalContentWrapper = styled(Dialog.Content)`
  z-index: 1;
  position: absolute;
  background: white;
  padding: 1rem;
  border: 1px solid;
`