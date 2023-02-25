import {useState} from 'react'
import {useParams} from 'react-router-dom'
import styled from 'styled-components/macro'

import { supabase } from '@/db/supabase'
import { useUser } from '@/_state/user'
import { logError } from '../../_util/error.js'

export default ({ hitDailyLimit }) => {

  const { langId } = useParams()
  const { user } = useUser()

  const [message, setMessage] = useState('')
  const [isSendingMessage, setIsSendingMessage] = useState(false)

  const sendMessage = async event => {
    event.preventDefault()
    if (!user) {
      alert('Sorry, you must be logged in to use this feature')
      return
    }
    try {
      setIsSendingMessage(true)

      const newData = {
        language_id: langId,
        content: message,
        sender_type: 'user',
        sender_id: user.id,
        created_at: new Date(),
        created_by: user.id,
      }

      const { error:insertError } = await supabase
        .from('chat_messages')
        .insert([newData])
      if (insertError) throw insertError

      setMessage('')
      setIsSendingMessage(false)

      triggerRemoteFunction()
      // location.reload() // use realtime now
    } catch (error) {
      setIsSendingMessage(false)
      logError('send message', error)
    }
  }

  // TODO - listener in db that calls this instead?
  const triggerRemoteFunction = async () => {
    console.log('triggering remote function')
    const requestData = {
      language_id: langId,
    }
    const { data: responseData, error:invokeError } = await supabase.functions.invoke('hello', {
      body: requestData,
    })
    if (invokeError) throw invokeError
    console.log(responseData)
  }

  return <ChatInputForm onSubmit={sendMessage}>
    <textarea
      value={message}
      disabled={isSendingMessage || hitDailyLimit}
      onChange={e => setMessage(e.target.value)}
      placeholder="Ciao"
    />
    <button
      type="submit"
      disabled={isSendingMessage || hitDailyLimit}
    >
      {isSendingMessage ? 'Sending...' : 'Send'}
    </button>
    {/* <span onClick={triggerRemoteFunction}>TEST</span> */}
  </ChatInputForm>
}

const ChatInputForm = styled.form`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  border-top: 1px solid;

  textarea,
  button {
    margin: 0;
    align-self: stretch;
  }
`
