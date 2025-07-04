import { NextResponse } from 'next/server';
import { getNewReleases, RawgGame } from '@/lib/rawg';

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

      // Get current date and date from 3 months ago
      const now = new Date();
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(now.getMonth() - 3);
      
      // Format dates as YYYY-MM-DD
      const toDate = now.toISOString().split('T')[0];
      const fromDate = threeMonthsAgo.toISOString().split('T')[0];

      const url = new URL(`${RAWG_BASE_URL}/games`);
      url.searchParams.append('key', RAWG_API_KEY);
      url.searchParams.append('dates', `${fromDate},${toDate}`);
      url.searchParams.append('ordering', '-added');
      url.searchParams.append('page_size', '20');  // Increased for more filtering options
      url.searchParams.append('metacritic', '70,100');  // Filter for games with decent metacritic scores
      
      console.log('Fetching from URL:', url.toString().replace(RAWG_API_KEY, '[API_KEY]'));
      
      const response = await fetch(url.toString(), { 
        cache: 'no-store' 
      });
      
      if (!response.ok) {
        throw new Error(`RAWG API error: ${response.status}`);
      }
      
      const directResults = await response.json();
      console.log(`Direct approach returned ${directResults.results?.length || 0} results`);
      
      // If not enough results with Metacritic filter, try with rating filter
      if (!directResults.results || directResults.results.length < 5) {
        const ratingUrl = new URL(`${RAWG_BASE_URL}/games`);
        ratingUrl.searchParams.append('key', RAWG_API_KEY);
        ratingUrl.searchParams.append('dates', `${fromDate},${toDate}`);
        ratingUrl.searchParams.append('ordering', '-added');
        ratingUrl.searchParams.append('page_size', '20');
        ratingUrl.searchParams.append('ratings_count', '5');  // At least 5 ratings
        
        const ratingResponse = await fetch(ratingUrl.toString(), { 
          cache: 'no-store' 
        });
        
        if (!ratingResponse.ok) {
          throw new Error(`RAWG API error: ${ratingResponse.status}`);
        }
        
        const ratingResults = await ratingResponse.json();
        
        // Filter locally for games with at least 3.5 rating
        if (ratingResults.results && ratingResults.results.length > 0) {
          ratingResults.results = ratingResults.results.filter((game: RawgGame) => game.rating >= 3.5);
          
          // Limit to 10 results after filtering
          ratingResults.results = ratingResults.results.slice(0, 10);
          
          return NextResponse.json(ratingResults);
        }
      }
      
      // Limit to 10 results
      if (directResults.results && directResults.results.length > 10) {
        directResults.results = directResults.results.slice(0, 10);
      }
      
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