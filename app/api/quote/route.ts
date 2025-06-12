import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const apiRes = await fetch('https://cpa-node-439821101939.europe-west1.run.app/api/quote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'your_app_api_key_here', 
      },
      body: JSON.stringify(body),
    });

    const data = await apiRes.json();
    return NextResponse.json(data, { status: apiRes.status });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to forward request', details: (error as Error).message },
      { status: 500 }
    );
  }
}