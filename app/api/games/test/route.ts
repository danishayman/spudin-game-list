import { NextResponse } from 'next/server';

const RAWG_API_KEY = process.env.RAWG_API_KEY;
const RAWG_BASE_URL = 'https://api.rawg.io/api';

export async function GET() {
  try {
    if (!RAWG_API_KEY) {
      throw new Error('RAWG API key is not defined');
    }

    // Get current date and date from 6 months ago
    const now = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(now.getMonth() - 6);
    
    // Format dates as YYYY-MM-DD
    const toDate = now.toISOString().split('T')[0];
    const fromDate = sixMonthsAgo.toISOString().split('T')[0];

    const url = new URL(`${RAWG_BASE_URL}/games`);
    url.searchParams.append('key', RAWG_API_KEY);
    url.searchParams.append('dates', `${fromDate},${toDate}`);
    url.searchParams.append('ordering', '-released');
    url.searchParams.append('page_size', '10');
    
    console.log('Fetching from URL:', url.toString());
    
    const response = await fetch(url.toString(), { 
      cache: 'no-store' 
    });
    
    if (!response.ok) {
      throw new Error(`RAWG API error: ${response.status}`);
    }
    
    const results = await response.json();
    
    return NextResponse.json({
      url: url.toString(),
      apiKey: RAWG_API_KEY ? 'Present (hidden)' : 'Missing',
      fromDate,
      toDate,
      results
    });
  } catch (error) {
    console.error('Error in test endpoint:', error);
    return NextResponse.json(
      { error: 'Test failed', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 