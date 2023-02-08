import styled from 'styled-components/macro'
import * as Dialog from '@radix-ui/react-dialog'

export default ({ isOpen, onClose, children }) => {
  return <Dialog.Root open={isOpen}>
    <Dialog.Portal>
      <ModalOverlay onClick={onClose} />
      <ModalWrapper>
        <ModalContentWrapper>
          <Dialog.Close onClick={onClose}>✖️</Dialog.Close>
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
  border: 1.5px solid;
  max-width: calc(100vw - 2rem);
`