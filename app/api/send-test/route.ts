import { NextRequest, NextResponse } from 'next/server';
import { sendInsuranceEmail } from '@/utils/sendEmail';

export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log('Received request body:', body);

  try {
    const info = await sendInsuranceEmail(body.email, {
      name: body.name,
      policyNumber: body.policyNumber,
      startDate: body.startDate,
      endDate: body.endDate,
    });
    console.log('Email sent info:', info);
    return NextResponse.json({ success: true });
  } catch (err) {
  console.error('Error in sendInsuranceEmail:', err);
  const message = err instanceof Error ? err.message : 'An unknown error occurred';
  return NextResponse.json({ success: false, message }, { status: 500 });
}
}
