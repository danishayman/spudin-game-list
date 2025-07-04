import { NextResponse } from 'next/server';
import { getNewReleases, RawgGame } from '@/lib/rawg';

const RAWG_API_KEY = process.env.RAWG_API_KEY;
const RAWG_BASE_URL = 'https://api.rawg.io/api';

export async function GET() {
  try {
    console.log('[API] /api/games/new-releases called');
    console.log('[API] RAWG_API_KEY exists:', !!RAWG_API_KEY);
    
    // Try the original method first
    const results = await getNewReleases();
    
    // If no results, try a direct approach
    if (!results.results || results.results.length === 0) {
      console.log('[API] No results from getNewReleases, trying direct approach');
      
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
      
      console.log('[API] Fetching from URL:', url.toString().replace(RAWG_API_KEY, '[API_KEY]'));
      
      try {
        const response = await fetch(url.toString(), { 
          next: { revalidate: 3600 } // Revalidate every hour instead of no-store
        });
        
        if (!response.ok) {
          console.error(`[API] RAWG API error: ${response.status} - ${response.statusText}`);
          const errorText = await response.text();
          console.error(`[API] Error response body: ${errorText}`);
          throw new Error(`RAWG API error: ${response.status}`);
        }
        
        const directResults = await response.json();
        console.log(`[API] Direct approach returned ${directResults.results?.length || 0} results`);
        
        // If not enough results with Metacritic filter, try with rating filter
        if (!directResults.results || directResults.results.length < 5) {
          const ratingUrl = new URL(`${RAWG_BASE_URL}/games`);
          ratingUrl.searchParams.append('key', RAWG_API_KEY);
          ratingUrl.searchParams.append('dates', `${fromDate},${toDate}`);
          ratingUrl.searchParams.append('ordering', '-added');
          ratingUrl.searchParams.append('page_size', '20');
          ratingUrl.searchParams.append('ratings_count', '5');  // At least 5 ratings
          
          console.log('[API] Trying with rating filter:', ratingUrl.toString().replace(RAWG_API_KEY, '[API_KEY]'));
          
          const ratingResponse = await fetch(ratingUrl.toString(), { 
            next: { revalidate: 3600 } // Revalidate every hour instead of no-store
          });
          
          if (!ratingResponse.ok) {
            console.error(`[API] Rating API error: ${ratingResponse.status} - ${ratingResponse.statusText}`);
            throw new Error(`RAWG API error: ${ratingResponse.status}`);
          }
          
          const ratingResults = await ratingResponse.json();
          console.log(`[API] Rating approach returned ${ratingResults.results?.length || 0} results`);
          
          // Filter locally for games with at least 3.5 rating
          if (ratingResults.results && ratingResults.results.length > 0) {
            ratingResults.results = ratingResults.results.filter((game: RawgGame) => game.rating >= 3.5);
            console.log(`[API] After filtering, ${ratingResults.results.length} results remain`);
            
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
      } catch (fetchError) {
        console.error('[API] Fetch error in direct approach:', fetchError);
        throw fetchError;
      }
    }
    
    return NextResponse.json(results);
  } catch (error) {
    console.error('[API] Error fetching new releases:', error);
    return NextResponse.json(
      { error: 'Failed to fetch new releases', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 