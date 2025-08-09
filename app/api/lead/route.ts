import { NextRequest, NextResponse } from 'next/server';
import { trackEvent } from '@/lib/analytics';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { service, leadVolume, mainGoal, name, email, phone } = body;

    // Validate required fields
    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: 'Name, email, and phone are required' },
        { status: 400 }
      );
    }

    // Create lead data object
    const leadData = {
      name,
      email,
      phone,
      service,
      leadVolume,
      mainGoal,
      source: 'hero_chat',
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get('user-agent'),
      ip: request.headers.get('x-forwarded-for') || 
          request.headers.get('x-real-ip') || 
          '127.0.0.1'
    };

    // Log the lead (in production, save to database)
    console.log('New lead captured:', leadData);
    
    // Track analytics event
    await trackEvent('lead_captured', {
      source: 'hero_chat',
      service,
      leadVolume,
      mainGoal,
      hasName: !!name,
      hasEmail: !!email,
      hasPhone: !!phone
    });

    // In production, you would:
    // 1. Save to Supabase database
    // 2. Send email notification via Resend
    // 3. Add to CRM system
    // 4. Send SMS notification

    // For now, simulate email sending
    console.log('Sending notification email for lead:', name);
    console.log('Lead details:', {
      service,
      leadVolume,
      mainGoal,
      contact: { name, email, phone }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Lead captured successfully' 
    });

  } catch (error) {
    console.error('Lead capture error:', error);
    return NextResponse.json(
      { error: 'Failed to capture lead' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Lead API endpoint is running',
    timestamp: new Date().toISOString()
  });
}