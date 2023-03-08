// https://supabase.com/docs/guides/functions/quickstart

// import 'xhr_polyfill' // Required for fetch() in Deno?
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'
// import { CreateCompletionRequest } from 'openai'

console.log("Boom, started chat reply function")

serve(async (req: Request) => {

  console.log("Got request")

  // Necessary to invoke function from browser
  // https://supabase.com/docs/guides/functions/cors#recommended-setup
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  console.log("Passed CORS check")

  try {
    // Get data from request (optional)
    const requestData = await req.json()
    if (!requestData.language_id) throw new Error('Missing language_id')

    console.log("Got info from request", JSON.stringify(requestData))

    // Create Supabase client instance
    // https://supabase.com/docs/guides/functions/auth
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      // Create client with Auth context of the user that called the function (for RLS)
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    if (!user) throw new Error('User not found')
    console.log("Got user", user.id)

    // Get recent user conversations from the db
    const { data: chat_messages, chatMessagesRequestError } = await supabaseClient
      .from('chat_messages')
      .select()
      .eq('language_id', requestData.language_id)
      .eq('created_by', user.id)
      .order('created_at', { ascending: true })
      .limit(5)
    if (chatMessagesRequestError) throw chatMessagesRequestError

    console.log("Got chat_messages", JSON.stringify(chat_messages))

    const messagesToSend = chat_messages.map((message) => `${message.sender_type === 'robot' ? 'Teacher: ' : 'Student: '} ${message.content}`).join('\n')
    const prompt = `Imagine you are an Italian teacher having a conversation with a beginner Italian language student. Please complete this conversation with a short message to the student in Italian.\n${messagesToSend}\nTeacher: `
    console.log("Generated prompt", prompt)

    // Get response from AI bot
    // https://supabase.com/docs/guides/functions/examples/openai
    const completionConfig = {
      model: 'text-davinci-003',
      // model: 'gpt-3.5-turbo',
      prompt,
      max_tokens: 256,
      temperature: 0,
      // stream: false,
    }
    const AIResponse = await fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${Deno.env.get('ADMIN_OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(completionConfig),
    }).catch((error) => {
      throw new Error(`Error fetching from Open AI - ${error.message}`)
    })

    if (!AIResponse.ok) {
      throw new Error(`Open AI API returned error: ${AIResponse.status}`)
    }

    const AIResult = await AIResponse.json()

    console.log("Got data from Open AI", JSON.stringify(AIResult))

    // Write response back to the db
    const chatResponse = {
      language_id: requestData.language_id,
      content: AIResult.choices[0].text,
      sender_type: 'robot',
      sender_id: null,
      created_at: new Date(),
      created_by: user.id,
    }
    const { data: chatReply, chatWriteError } = await supabaseClient
      .from('chat_messages')
      .insert([chatResponse])
      .select()
    if (chatWriteError) throw chatWriteError

    console.log("Sent the AI reply to the db", JSON.stringify(chatReply))

    // Return 200
    const responseData = {
      userId: user.id,
      numMessages: chat_messages.length,
    }
    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }

})
