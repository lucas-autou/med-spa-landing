import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSession } from '@/lib/stripe';
import { trackConversion } from '@/lib/analytics';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      planType, 
      customerEmail, 
      customerName, 
      successUrl, 
      cancelUrl, 
      leadData 
    } = body;

    // Validate required fields
    if (!planType || !successUrl || !cancelUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!['FULL', 'PILOT'].includes(planType)) {
      return NextResponse.json(
        { error: 'Invalid plan type' },
        { status: 400 }
      );
    }

    // Create checkout session
    const session = await createCheckoutSession({
      planType,
      customerEmail,
      customerName,
      successUrl,
      cancelUrl,
      leadData,
    });

    // Track checkout initiation
    const amount = planType === 'FULL' ? 997 : 297;
    
    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });

  } catch (error) {
    console.error('Error creating checkout session:', error);
    
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}