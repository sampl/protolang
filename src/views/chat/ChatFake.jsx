import {useEffect, useRef, useState} from 'react'

import styled from 'styled-components/macro'
import ChatFakeMessages from './ChatFakeMessages'

// TODO - animated typing
// https://codepen.io/clemens/pen/ZOrGgd
export default () => {

  const [isTyping, setIsTyping] = useState(false)
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
  
  useInterval(() => {
    console.log('I fire every second!');
    if (isTyping) {
      setIsTyping(false)
      return
    }
    setIsTyping(true)
    setCurrentMessageIndex(currentMessageIndex + 1)
  }, 3000)

  return <ChatListWrapper>
    {ChatFakeMessages.map( (message, index) => {
      if (currentMessageIndex < index) {
        return null
      }
      const messageIsTyping = isTyping && currentMessageIndex === index
      return <ChatMessageWrapper key={index} sender={message.sender}>
        <ChatMessageBubble sender={message.sender}>
          {!messageIsTyping ? message.content : '...'}
        </ChatMessageBubble>
        {!messageIsTyping && <ChatMessageTime>{message.time}</ChatMessageTime>}
      </ChatMessageWrapper>
    })}
  </ChatListWrapper>
}

export const ChatListWrapper = styled.div`
  margin: 0 auto;
  width: 100%;
  max-width: 900px;
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 0);
  user-select: none;
`
export const ChatMessageWrapper = styled.div`
  display: block;
  margin: 0 0 1rem;
  text-align: ${props => props.sender === 'bot' ? 'left' : 'right'};
`
export const ChatMessageBubble = styled.div`
  display: inline-block;
  padding: 1rem;
  left: ${props => props.sender === 'bot' ? '0' : 'auto'};
  right: ${props => props.sender === 'human' ? '0' : 'auto'};

  font-size: normal;
  background: ${props => props.sender === 'bot' ? '#eee' : '#333'};
  color: ${props => props.sender === 'bot' ? '#333' : '#eee'};
  border-radius: 50px;
`
export const ChatMessageTime = styled.div`
  margin: .25rem 0 0 1rem;
  font-size: small;
`

// https://www.joshwcomeau.com/snippets/react-hooks/use-interval/
function useInterval(callback, delay) {
  const intervalRef = useRef(null);
  const savedCallback = useRef(callback);
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  useEffect(() => {
    const tick = () => savedCallback.current();
    if (typeof delay === 'number') {
      intervalRef.current = window.setInterval(tick, delay);
      return () => window.clearInterval(intervalRef.current);
    }
  }, [delay]);
  return intervalRef;
}

