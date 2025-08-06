import { NextResponse } from 'next/server';
import { getNewReleases, IgdbGame} from '@/lib/igdb';

const RAWG_API_KEY = process.env.RAWG_API_KEY;
const RAWG_BASE_URL = 'https://api.rawg.io/api';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function GET(request: Request) {
  try {
    console.log('[API] /api/games/new-releases called');
    console.log('[API] RAWG_API_KEY exists:', !!RAWG_API_KEY);
    console.log('[API] Environment:', process.env.NODE_ENV);
    
    // Set CORS headers
    const headers = corsHeaders;
    
    // Get count parameter from URL if present
    const url = new URL(request.url);
    const countParam = url.searchParams.get('count');
    const count = countParam ? parseInt(countParam, 10) : 25;
    
    console.log('[API] Requested count:', count);
    
    // Check for required API key
    if (!RAWG_API_KEY) {
      console.error('[API] RAWG API key is missing');
      return NextResponse.json(
        { error: 'Failed to fetch new releases', details: 'API key is missing' },
        { status: 500, headers }
      );
    }
    
    // Try the original method first - now with improved fallback to stale cache
    const results = await getNewReleases();
    
    // Add debug information
    console.log('[API] Results count:', results?.results?.length || 0);
    console.log('[API] Page size in URL:', results?.next?.includes('page_size=25') ? '20' : 'other');
    
    // If we got results from either fresh API call or cache fallback, return them
    if (results && results.results && results.results.length > 0) {
      // Make sure we return the requested number of results
      if (results.results.length > count) {
        results.results = results.results.slice(0, count);
      }
      
      // Add debugging info to the response
      const debugResults = {
        ...results,
        debug: {
          resultsCount: results.results.length,
          requestedCount: count,
          pageSize: results.next?.includes('page_size=20') ? '20' : 'other',
          apiKeyExists: !!RAWG_API_KEY,
          environment: process.env.NODE_ENV
        }
      };
      return NextResponse.json(debugResults, { headers });
    }
    
    // If we still have no results, try a direct approach as last resort
    console.log('[API] No results from getNewReleases, trying direct approach');
    
    // Get current date and date from 3 months ago
    const now = new Date();
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(now.getMonth() - 3);
    
    // Format dates as YYYY-MM-DD
    const toDate = now.toISOString().split('T')[0];
    const fromDate = threeMonthsAgo.toISOString().split('T')[0];

    const directUrl = new URL(`${RAWG_BASE_URL}/games`);
    directUrl.searchParams.append('key', RAWG_API_KEY);
    directUrl.searchParams.append('dates', `${fromDate},${toDate}`);
    directUrl.searchParams.append('ordering', '-added');
    directUrl.searchParams.append('page_size', count.toString());  // Use requested count
    directUrl.searchParams.append('metacritic', '70,100');  // Filter for games with decent metacritic scores
    
    console.log('[API] Fetching from URL:', directUrl.toString().replace(RAWG_API_KEY, '[API_KEY]'));
    
    try {
      const response = await fetch(directUrl.toString(), { 
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
        ratingUrl.searchParams.append('page_size', count.toString());  // Use requested count
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
        
        // Filter locally for games with at least 3.0 rating (lowered from 3.5)
        if (ratingResults.results && ratingResults.results.length > 0) {
          ratingResults.results = ratingResults.results.filter((game: IgdbGame) => game.rating != null && game.rating >= 3.0);
          console.log(`[API] After filtering, ${ratingResults.results.length} results remain`);
          
          // Limit to requested count
          if (ratingResults.results.length > count) {
            ratingResults.results = ratingResults.results.slice(0, count);
          }
          
          // Add debugging info
          const debugRatingResults = {
            ...ratingResults,
            debug: {
              resultsCount: ratingResults.results.length,
              requestedCount: count,
              pageSize: ratingResults.next?.includes(`page_size=${count}`) ? count.toString() : 'other',
              apiKeyExists: !!RAWG_API_KEY,
              environment: process.env.NODE_ENV
            }
          };
          
          return NextResponse.json(debugRatingResults, { headers });
        }
      }
      
      // Limit to requested count
      if (directResults.results && directResults.results.length > count) {
        directResults.results = directResults.results.slice(0, count);
      }
      
      // Add debugging info
      const debugDirectResults = {
        ...directResults,
        debug: {
          resultsCount: directResults.results.length,
          requestedCount: count,
          pageSize: directResults.next?.includes(`page_size=${count}`) ? count.toString() : 'other',
          apiKeyExists: !!RAWG_API_KEY,
          environment: process.env.NODE_ENV
        }
      };
      
      return NextResponse.json(debugDirectResults, { headers });
    } catch (fetchError) {
      console.error('[API] Fetch error in direct approach:', fetchError);
      throw fetchError;
    }
  } catch (error) {
    console.error('[API] Error fetching new releases:', error);
    return NextResponse.json(
      { error: 'Failed to fetch new releases', details: error instanceof Error ? error.message : String(error) },
      { status: 500, headers: corsHeaders }
    );
  }
} 