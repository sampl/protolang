// https://supabase.com/docs/guides/functions/quickstart

// import 'xhr_polyfill' // Required for fetch() in Deno?
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'
// import { CreateCompletionRequest } from 'openai'

console.log("Boom, started AI prompt function")

serve(async (req: Request) => {

  console.log("Got request")

  // Necessary to invoke function from browser
  // https://supabase.com/docs/guides/functions/cors#recommended-setup
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  console.log("Passed CORS check")

  try {
    // Get data from request (optional)
    const requestData = await req.json()
    if (!requestData.prompt) throw new Error('Missing prompt')
    console.log("Got info from request", JSON.stringify(requestData))

    // Get response from AI bot
    // https://supabase.com/docs/guides/functions/examples/openai
    const completionConfig = {
      model: 'text-davinci-003',
      // model: 'gpt-3.5-turbo',
      prompt: requestData.prompt,
      max_tokens: 256,
      temperature: 0,
      // stream: false,
    }
    console.log("completionConfig", JSON.stringify(completionConfig))

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

    const promptResponse = AIResult.choices[0].text
    console.log("Parsed response", promptResponse)

    // Return 200
    const responseData = {
      promptResponse,
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
