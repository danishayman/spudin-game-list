import { NextResponse } from 'next/server';

const RAWG_API_KEY = process.env.RAWG_API_KEY;
const RAWG_BASE_URL = 'https://api.rawg.io/api';

export async function GET() {
  try {
    console.log('[TEST API] Test endpoint called');
    console.log('[TEST API] RAWG_API_KEY exists:', !!RAWG_API_KEY);
    
    // Check for required API key
    if (!RAWG_API_KEY) {
      console.error('[TEST API] RAWG API key is missing');
      return NextResponse.json(
        { error: 'API key is missing' },
        { status: 500 }
      );
    }
    
    // Get current date and date from 3 months ago
    const now = new Date();
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(now.getMonth() - 3);
    
    // Format dates as YYYY-MM-DD
    const toDate = now.toISOString().split('T')[0];
    const fromDate = threeMonthsAgo.toISOString().split('T')[0];

    // Create a direct URL to test with page_size=20
    const url = new URL(`${RAWG_BASE_URL}/games`);
    url.searchParams.append('key', RAWG_API_KEY);
    url.searchParams.append('dates', `${fromDate},${toDate}`);
    url.searchParams.append('ordering', '-added');
    url.searchParams.append('page_size', '20');
    url.searchParams.append('ratings_count', '5');  // At least 5 ratings
    
    console.log('[TEST API] Fetching from URL:', url.toString().replace(RAWG_API_KEY, '[API_KEY]'));
    
    // Make the API call with cache disabled to ensure fresh results
    const response = await fetch(url.toString(), { 
      cache: 'no-store'
    });
    
    if (!response.ok) {
      console.error(`[TEST API] RAWG API error: ${response.status} - ${response.statusText}`);
      const errorText = await response.text();
      console.error(`[TEST API] Error response body: ${errorText}`);
      throw new Error(`RAWG API error: ${response.status}`);
    }
    
    const results = await response.json();
    
    // Add debug information to the response
    const debugResults = {
      ...results,
      debug: {
        resultsCount: results.results?.length || 0,
        pageSize: results.next?.includes('page_size=20') ? '20' : 'other',
        apiKeyExists: !!RAWG_API_KEY,
        url: url.toString().replace(RAWG_API_KEY, '[API_KEY]')
      }
    };
    
    return NextResponse.json(debugResults);
  } catch (error) {
    console.error('[TEST API] Error:', error);
    return NextResponse.json(
      { error: 'Test failed', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 