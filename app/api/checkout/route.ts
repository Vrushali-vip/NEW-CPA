import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Forward the request to your backend API
    const apiRes = await fetch('https://cpa-node-439821101939.europe-west1.run.app/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add your API key if required:
        'x-api-key': 'your_app_api_key_here',
      },
      body: JSON.stringify(body),
    });

    const data = await apiRes.json();
    return NextResponse.json(data, { status: apiRes.status });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to forward request', details: (error as Error).message }, { status: 500 });
  }
}

export function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}