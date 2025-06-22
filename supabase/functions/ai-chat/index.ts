
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { message, agent, context } = await req.json()
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY')

    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY is not configured')
    }

    // Create system prompt based on agent type
    let systemPrompt = ''
    
    switch (agent) {
      case 'temple':
        systemPrompt = `You are a knowledgeable Temple Guide AI assistant. You specialize in Indian temples, their history, significance, rituals, timings, dress codes, and spiritual guidance. Provide helpful, accurate, and respectful information about Hindu, Buddhist, Jain, and Sikh temples. Always be culturally sensitive and promote spiritual understanding.`
        break
      case 'senior':
        systemPrompt = `You are a Senior Travel Assistant AI specialized in making temple visits comfortable and accessible for elderly visitors. Focus on wheelchair accessibility, medical facilities, comfortable accommodations, easy transportation, and safety considerations. Be empathetic and practical in your advice.`
        break
      case 'planner':
        systemPrompt = `You are a Trip Planner AI expert in organizing spiritual journeys and temple visits across India. Provide detailed itineraries, transportation options, accommodation suggestions, cost estimates, and timing recommendations. Consider seasonal factors, festivals, and regional variations.`
        break
      default:
        systemPrompt = `You are a helpful Temple Guardian AI assistant. Provide information about Indian temples, spiritual practices, and travel guidance with respect and cultural sensitivity.`
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to get AI response')
    }

    const aiResponse = data.choices[0]?.message?.content || 'I apologize, I could not generate a response.'

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in ai-chat function:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process your request',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
