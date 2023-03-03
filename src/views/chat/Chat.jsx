import {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import styled from 'styled-components/macro'

import { supabase, useSupabaseQuery } from '@/db/supabase'
import { useUser } from '@/_state/user'
import ChatMessages from './ChatMessages'
import ChatInput from './ChatInput'
import { TwoColumns } from '@/styles/Layout'

const DAILY_LIMIT = 4

export default () => {

  const { langId } = useParams()
  const { user, loading: userLoading } = useUser()

  const [latestMessage, setLatestMessage] = useState(null)

  // const today = new Date()
  // const year = today.getFullYear()
  // const month = String(today.getMonth() + 1).padStart(2, '0')
  // const day = String(today.getDate()).padStart(2, '0')
  // const formattedDate = `${year}-${month}-${day}`

  const chatsQuery = supabase
    .from('chat_messages')
    .select()
    .eq('language_id', langId)
    .eq('created_by', user?.id)
    .order('created_at', { ascending: true })
    // https://supabase.com/docs/reference/javascript/rangegt
    // operator is not unique: timestamp with time zone <@ unknown
    // .containedBy('created_at', `${formattedDate} 00:00, ${formattedDate} 23:59)`)
  const [chatMessages, chatMessagesLoading, chatMessagesError] = useSupabaseQuery(chatsQuery, [langId, user?.id, latestMessage], (!user?.id || !langId))

  useEffect(() => {
    const channel = supabase
      .channel('chat-message-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `created_by=eq.${user?.id}`,
        },
        (payload) => {
          // TODO - don't run the whole chat query again, just add the new message
          setLatestMessage(payload.commit_timestamp)
        }
      ).subscribe()

      return () => {
        channel.unsubscribe()
      }
    }, [])

  const override = localStorage.getItem('protolang-temporary-chat-limit-override')
  const hitDailyLimit = chatMessages && chatMessages.length >= DAILY_LIMIT && !override

  if (chatMessagesError) return <div>error: {chatMessagesError.message}</div>
  // console.log(user, userLoading)
  if (user && chatMessagesLoading) return <div>loading...</div>

  return <TwoColumns cols="5fr 2fr" tall>
    <ChatWrapper>
      <ChatMessages chatMessages={chatMessages} hitDailyLimit={hitDailyLimit} />
      <ChatInput hitDailyLimit={hitDailyLimit} />
    </ChatWrapper>
    <ChatSidebar>
      Topics (coming soon):
      <select disabled>
        <option>All topics</option>
      </select>
      <br />
      Skill level (coming soon):
      <select disabled>
        <option>Beginner</option>
      </select>
    </ChatSidebar>
  </TwoColumns>
}

export const ChatWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
`
export const ChatSidebar = styled.div`
  border-left: 1px solid;
  padding: 0 0 0 2rem;
`