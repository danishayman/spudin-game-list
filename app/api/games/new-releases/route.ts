import { NextResponse } from 'next/server';
import { getNewReleases } from '@/lib/services/igdb';
import { IgdbGame } from '@/types/igdb';

const RAWG_API_KEY = process.env.RAWG_API_KEY;
const RAWG_BASE_URL = 'https://api.rawg.io/api';
const IGDB_CLIENT_ID = process.env.IGDB_CLIENT_ID;
const IGDB_CLIENT_SECRET = process.env.IGDB_CLIENT_SECRET;

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
    console.log('[API] IGDB_CLIENT_ID exists:', !!IGDB_CLIENT_ID);
    console.log('[API] IGDB_CLIENT_SECRET exists:', !!IGDB_CLIENT_SECRET);
    console.log('[API] RAWG_API_KEY exists:', !!RAWG_API_KEY);
    console.log('[API] Environment:', process.env.NODE_ENV);
    
    // Set CORS headers
    const headers = corsHeaders;
    
    // Get count parameter from URL if present
    const url = new URL(request.url);
    const countParam = url.searchParams.get('count');
    const count = countParam ? parseInt(countParam, 10) : 25;
    
    console.log('[API] Requested count:', count);
    
    // Check for required IGDB API credentials first (primary method)
    if (!IGDB_CLIENT_ID || !IGDB_CLIENT_SECRET) {
      console.error('[API] IGDB credentials are missing');
      
      // If RAWG is also missing, return error
      if (!RAWG_API_KEY) {
        return NextResponse.json(
          { 
            error: 'Failed to fetch new releases', 
            details: 'Both IGDB and RAWG API credentials are missing. Please configure IGDB_CLIENT_ID and IGDB_CLIENT_SECRET environment variables.' 
          },
          { status: 500, headers }
        );
      }
      
      console.log('[API] Falling back to RAWG API due to missing IGDB credentials');
      // Skip IGDB method and go directly to RAWG fallback
    } else {
      // Try the IGDB method first
      try {
        console.log('[API] Attempting to fetch from IGDB');
        const results = await getNewReleases();
        
        // Add debug information
        console.log('[API] IGDB Results count:', results?.results?.length || 0);
        
        // If we got results from IGDB, return them
        if (results && results.results && results.results.length > 0) {
          // Make sure we return the requested number of results
          if (results.results.length > count) {
            results.results = results.results.slice(0, count);
          }
          
          // Add debugging info to the response
          const debugResults = {
            ...results,
            debug: {
              source: 'IGDB',
              resultsCount: results.results.length,
              requestedCount: count,
              igdbCredentialsExist: !!IGDB_CLIENT_ID && !!IGDB_CLIENT_SECRET,
              rawgKeyExists: !!RAWG_API_KEY,
              environment: process.env.NODE_ENV
            }
          };
          return NextResponse.json(debugResults, { headers });
        }
        
        console.log('[API] No results from IGDB, falling back to RAWG');
      } catch (igdbError) {
        console.error('[API] IGDB method failed:', igdbError);
        console.log('[API] Falling back to RAWG API');
      }
    }
    
    // If we still have no results and have RAWG API key, try RAWG as fallback
    if (!RAWG_API_KEY) {
      console.error('[API] No RAWG API key available for fallback');
      return NextResponse.json(
        { 
          error: 'Failed to fetch new releases', 
          details: 'IGDB returned no results and no RAWG API key available for fallback. Please configure API credentials.' 
        },
        { status: 500, headers }
      );
    }
    
    console.log('[API] Trying RAWG API as fallback');
    
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
              source: 'RAWG',
              resultsCount: ratingResults.results.length,
              requestedCount: count,
              pageSize: ratingResults.next?.includes(`page_size=${count}`) ? count.toString() : 'other',
              igdbCredentialsExist: !!IGDB_CLIENT_ID && !!IGDB_CLIENT_SECRET,
              rawgKeyExists: !!RAWG_API_KEY,
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
          source: 'RAWG',
          resultsCount: directResults.results.length,
          requestedCount: count,
          pageSize: directResults.next?.includes(`page_size=${count}`) ? count.toString() : 'other',
          igdbCredentialsExist: !!IGDB_CLIENT_ID && !!IGDB_CLIENT_SECRET,
          rawgKeyExists: !!RAWG_API_KEY,
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