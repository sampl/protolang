import {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import styled from 'styled-components/macro'

import { supabase, useSupabaseQuery } from '@/db/supabase'
import { useUser } from '@/_state/user'
import ChatMessages from './ChatMessages'
import ChatInput from './ChatInput'

const DAILY_LIMIT = 4

export default () => {

  const { langId } = useParams()
  const { user } = useUser()

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
  const [chatMessages, chatMessagesLoading, chatMessagesError] = useSupabaseQuery(chatsQuery, [langId, user?.id, latestMessage], (!user.id || !langId))

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

  const hitDailyLimit = chatMessages && chatMessages.length >= DAILY_LIMIT

  if (chatMessagesError) return <div>error: {chatMessagesError.message}</div>
  if (chatMessagesLoading) return <div>loading...</div>

  return <ChatWrapper>
    <ChatMessages chatMessages={chatMessages} hitDailyLimit={hitDailyLimit} />
    <ChatInput hitDailyLimit={hitDailyLimit} />
  </ChatWrapper>
}

export const ChatWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
`