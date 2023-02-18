import { Badge } from '@/styles/Badge'
import ChatWaitlistForm from './ChatWaitlistForm'
// import { Link, useParams } from 'react-router-dom'
import styled from 'styled-components/macro'
import ChatFake from './ChatFake'

export default () => {

  // const { langId } = useParams()

  return <ChatPromoWrapper>
    <ChatPromoContent>
      <div style={{textAlign: 'center'}}>
        <Badge>Coming soon</Badge>
        <h1 style={{margin: '.5rem 0 1rem'}}>Your AI Italian conversation partner</h1>
        <p>Natural, fluent dialog in your target language</p>
      </div>
      <ul>
        <li>Corrects grammar and spelling</li>
        <li>Look up words on the fly</li>
        <li>Analytics built-in</li>
        <li>Powered by GPT-3</li>
      </ul>
      <ChatWaitlistForm />
    </ChatPromoContent>
    <ChatPromoBackground>
      <ChatPromoScreen />
      <ChatFake />
    </ChatPromoBackground>
  </ChatPromoWrapper>
}

export const ChatPromoWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 2rem;
`
export const ChatPromoContent = styled.div`
  padding: 4rem;
  border: 1px solid;
  background: white;
  box-shadow: 3px 3px;
  max-width: 500px;
  z-index: 100;
  position: relative;
`
export const ChatPromoBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
`
export const ChatPromoScreen = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  background: linear-gradient( hsla(0, 0%, 100%, 0.999), hsla(0, 0%, 100%, 0.5) 300px );
`
