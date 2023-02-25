import styled from 'styled-components/macro'

import { Badge } from '@/styles/Badge'
import ChatWaitlistForm from './ChatWaitlistForm'

export default () => {
  return <ChatEmptyStateWrapper>
    <ChatUpgradeContent>
      <p><strong>You've hit your daily limit</strong></p>
      <p>Sign up to get notified when we launch</p>
      <ChatWaitlistForm />
    </ChatUpgradeContent>
  </ChatEmptyStateWrapper>
}

export const ChatEmptyStateWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`
export const ChatUpgradeContent = styled.div`
  max-width: 500px;
  text-align: center;
  margin-bottom: 3rem;
`
