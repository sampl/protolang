import styled from 'styled-components/macro'
import * as Dialog from '@radix-ui/react-dialog'

export default ({ isOpen, onClose, title, maxWidth = '600px', children }) => {
  return <Dialog.Root open={isOpen}>
    <Dialog.Portal>
      <ModalOverlay onClick={onClose} />
      <ModalWrapper>
        <ModalContentWrapper style={{maxWidth}}>
          <ModalX onClick={onClose}>✕</ModalX>
          <ModalTitle>{title}</ModalTitle>
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
  z-index: 100;
`
const ModalOverlay = styled(Dialog.Overlay)`
  background: hsla(0, 0%, 100%, .8);
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
`
const ModalContentWrapper = styled(Dialog.Content)`
  z-index: 200;
  position: absolute;
  background: white;
  padding: 2rem;
  border: 1px solid;
  max-width: calc(100vw - 2rem);
  box-shadow: 3px 3px;
`
const ModalX = styled(Dialog.Close)`
  z-index: 1;
  position: absolute;
  top: 0;
  right: 0;
  background: white;
  padding: 1rem;
  border: none;
  text-decoration: none;
`
const ModalTitle = styled(Dialog.Title)`
  margin: 0 0 1rem;
`