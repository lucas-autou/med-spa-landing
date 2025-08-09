import { NextRequest, NextResponse } from 'next/server';
import { generateAIResponse, generateTreatmentResponse, generateBookingResponse } from '@/lib/aiService';
import { trackEvent } from '@/lib/analytics';

export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const body = await req.json();
    const { 
      message, 
      conversationHistory = [], 
      context = {},
      mode = 'general' // 'general', 'treatment', 'booking'
    } = body;

    // Validate required fields
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      );
    }

    // Validate API key
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
      console.error('OpenAI API key not configured');
      return NextResponse.json(
        { 
          response: "I'm currently offline for maintenance. Please try the guided demo or contact us directly!",
          chips: ['Try demo', 'Contact us', 'See pricing'],
          requiresConsult: false,
          safetyFlags: [],
          confidence: 0.5,
          followUpAction: 'none'
        },
        { status: 200 } // Return 200 to avoid breaking the UI
      );
    }

    // Generate AI response based on mode
    let aiResponse;
    
    switch (mode) {
      case 'treatment':
        if (context.treatment) {
          aiResponse = await generateTreatmentResponse(
            context.treatment,
            message,
            conversationHistory
          );
        } else {
          aiResponse = await generateAIResponse(message, conversationHistory, context);
        }
        break;
        
      case 'booking':
        aiResponse = await generateBookingResponse(
          message,
          context,
          conversationHistory
        );
        break;
        
      default:
        aiResponse = await generateAIResponse(message, conversationHistory, context);
    }

    // Track analytics
    try {
      trackEvent('ai_chat_response', {
        user_message_length: message.length,
        response_length: aiResponse.response.length,
        confidence: aiResponse.confidence || 0.5,
        has_safety_flags: !!(aiResponse.safetyFlags && aiResponse.safetyFlags.length > 0),
        follow_up_action: aiResponse.followUpAction || 'none',
        mode
      });
    } catch (analyticsError) {
      console.warn('Analytics tracking failed:', analyticsError);
    }

    // Return response
    return NextResponse.json(aiResponse);

  } catch (error) {
    console.error('Chat API Error:', error);
    
    // Return fallback response instead of error to maintain UX
    return NextResponse.json({
      response: "I'm having a brief connection issue. Could you try rephrasing your question or selecting one of the options below?",
      chips: ['Book appointment', 'See pricing', 'Try again'],
      requiresConsult: false,
      safetyFlags: [],
      confidence: 0.3,
      followUpAction: 'none'
    });
  }
}

// Health check endpoint
export async function GET() {
  try {
    // Check if API key is configured
    const hasApiKey = !!(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here');
    
    return NextResponse.json({
      status: 'ok',
      hasApiKey,
      model: process.env.OPENAI_MODEL || 'gpt-5-nano',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      { status: 'error', error: 'Health check failed' },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}