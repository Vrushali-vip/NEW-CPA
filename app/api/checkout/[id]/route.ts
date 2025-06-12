import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    // Forward the GET request to your backend API
    const apiRes = await fetch(`https://cpa-node-439821101939.europe-west1.run.app/api/checkout/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'your_app_api_key_here', // Uncomment if needed
      },
    });

    const data = await apiRes.json();
    return NextResponse.json(data, { status: apiRes.status });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch checkout status', details: (error as Error).message },
      { status: 500 }
    );
  }
}