import { NextResponse } from 'next/server';
import { getNewReleases } from '@/lib/rawg';

const RAWG_API_KEY = process.env.RAWG_API_KEY;
const RAWG_BASE_URL = 'https://api.rawg.io/api';

export async function GET() {
  try {
    // Try the original method first
    const results = await getNewReleases();
    
    // If no results, try a direct approach
    if (!results.results || results.results.length === 0) {
      console.log('No results from getNewReleases, trying direct approach');
      
      if (!RAWG_API_KEY) {
        throw new Error('RAWG API key is not defined');
      }

      // Get current date and date from 12 months ago
      const now = new Date();
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(now.getFullYear() - 1);
      
      // Format dates as YYYY-MM-DD
      const toDate = now.toISOString().split('T')[0];
      const fromDate = oneYearAgo.toISOString().split('T')[0];

      const url = new URL(`${RAWG_BASE_URL}/games`);
      url.searchParams.append('key', RAWG_API_KEY);
      url.searchParams.append('dates', `${fromDate},${toDate}`);
      url.searchParams.append('ordering', '-added');
      url.searchParams.append('page_size', '10');
      
      console.log('Fetching from URL:', url.toString().replace(RAWG_API_KEY, '[API_KEY]'));
      
      const response = await fetch(url.toString(), { 
        cache: 'no-store' 
      });
      
      if (!response.ok) {
        throw new Error(`RAWG API error: ${response.status}`);
      }
      
      const directResults = await response.json();
      console.log(`Direct approach returned ${directResults.results?.length || 0} results`);
      
      return NextResponse.json(directResults);
    }
    
    return NextResponse.json(results);
  } catch (error) {
    console.error('Error fetching new releases:', error);
    return NextResponse.json(
      { error: 'Failed to fetch new releases' },
      { status: 500 }
    );
  }
} 