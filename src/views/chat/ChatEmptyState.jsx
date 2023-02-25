import styled from 'styled-components/macro'

import { Badge } from '@/styles/Badge'
import ChatWaitlistForm from './ChatWaitlistForm'

export default () => {
  return <ChatEmptyStateWrapper>
    <ChatPromoContent>
      <Badge>Alpha test</Badge>
      <h1 style={{margin: '.5rem 0 1rem'}}>Your AI Italian conversation partner</h1>
      <p>Natural, fluent dialog in your target language</p>
      <ul>
        <li>Look up words on the fly</li>
        <li>Corrects grammar and spelling <Badge>Coming soon</Badge></li>
        <li>Powered by GPT-3</li>
        {/* <li>Analytics built-in</li> */}
      </ul>
      {/* <ChatWaitlistForm /> */}
      <p>⬇️ TYPE SOMETHING IN ITALIAN BELOW ⬇️</p>
    </ChatPromoContent>
  </ChatEmptyStateWrapper>
}

export const ChatEmptyStateWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 2rem;
`
export const ChatPromoContent = styled.div`
  max-width: 500px;
`
