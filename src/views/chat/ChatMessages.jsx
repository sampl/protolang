import {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import styled from 'styled-components/macro'
import moment from 'moment'

import { supabase, useSupabaseQuery } from '@/db/supabase'
import { useUser } from '@/_state/user'
import ChatInput from './ChatInput'
import ChatEmptyState from './ChatEmptyState'
import ChatUpgradePrompt from './ChatUpgradePrompt'
import Definable from '@/views/lessons/Definable'

export default ({ chatMessages, hitDailyLimit }) => {

  const showEmptyState = !chatMessages || chatMessages.length === 0

  return <ChatWrapper>
    {
      showEmptyState ? <ChatEmptyState />  :
      <ChatListWrapper>
        {chatMessages.map((message, index) => {
          return <ChatMessageWrapper key={message.id} sender={message.sender_type}>
            <ChatMessageBubble sender={message.sender_type}>
              <Definable wordString={message.content} />
            </ChatMessageBubble>
            <ChatMessageTime>{message.fake_time || moment(message.created_at).fromNow()}</ChatMessageTime>
          </ChatMessageWrapper>
        })}
        {hitDailyLimit && <ChatUpgradePrompt />}
      </ChatListWrapper>
    }
  </ChatWrapper>
}

export const ChatWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`
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
  text-align: ${props => props.sender === 'robot' ? 'left' : 'right'};
`
export const ChatMessageBubble = styled.div`
  display: inline-block;
  padding: .5rem 1rem;
  left: ${props => props.sender === 'robot' ? '0' : 'auto'};
  right: ${props => props.sender === 'user' ? '0' : 'auto'};

  font-size: normal;
  background: ${props => props.sender === 'robot' ? '#eee' : '#333'};
  color: ${props => props.sender === 'robot' ? '#333' : '#eee'};
  /* border-radius: 50px; */
`
export const ChatMessageTime = styled.div`
  margin: .25rem 0 0 1rem;
  font-size: small;
`
