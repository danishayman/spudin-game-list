import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

const IGDB_CLIENT_ID = process.env.IGDB_CLIENT_ID;
const IGDB_CLIENT_SECRET = process.env.IGDB_CLIENT_SECRET;
const IGDB_BASE_URL = 'https://api.igdb.com/v4';

// Simple in-memory rate limiting
// In production, consider using a distributed solution like Redis
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour window
const MAX_REQUESTS_PER_WINDOW = 10; // 10 requests per hour
const ipRequestMap = new Map<string, { count: number, timestamp: number }>();

// Check rate limit for an IP
function checkRateLimit(ip: string): { allowed: boolean, resetInSeconds?: number } {
  const now = Date.now();
  const record = ipRequestMap.get(ip);
  
  // If no record exists or the window has expired, create a new record
  if (!record || (now - record.timestamp) > RATE_LIMIT_WINDOW) {
    ipRequestMap.set(ip, { count: 1, timestamp: now });
    return { allowed: true };
  }
  
  // If within the window but under the limit, increment the count
  if (record.count < MAX_REQUESTS_PER_WINDOW) {
    record.count++;
    ipRequestMap.set(ip, record);
    return { allowed: true };
  }
  
  // Rate limit exceeded
  const resetInSeconds = Math.ceil((record.timestamp + RATE_LIMIT_WINDOW - now) / 1000);
  return { 
    allowed: false, 
    resetInSeconds
  };
}

export async function GET(request: Request) {
  try {
    // Get client IP for rate limiting
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : 'unknown';
    
    // Check for API key authentication first
    const apiKey = process.env.ADMIN_API_KEY;
    let isAuthorized = false;
    let isApiKeyAuth = false;
    
    if (apiKey) {
      // Check if API key is provided in the request header
      const authHeader = request.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const providedApiKey = authHeader.substring(7); // Remove 'Bearer ' prefix
        if (providedApiKey === apiKey) {
          isAuthorized = true;
          isApiKeyAuth = true;
          console.log('[TEST API] Authorized via API key');
        }
      }
    }
    
    // If not authorized via API key, check if user is authenticated and has admin privileges
    if (!isAuthorized) {
      const supabaseServer = await createClient();
      const { data: { user }, error: authError } = await supabaseServer.auth.getUser();
      
      if (authError || !user) {
        return NextResponse.json(
          { error: 'Unauthorized: Authentication required' },
          { status: 401 }
        );
      }
      
      // Fetch user profile to check admin status
      const { data: profile, error: profileError } = await supabaseServer
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();
      
      if (profileError || !profile || !profile.is_admin) {
        return NextResponse.json(
          { error: 'Forbidden: Admin privileges required' },
          { status: 403 }
        );
      }
      
      isAuthorized = true;
      console.log('[TEST API] Authorized via admin user');
    }
    
    // Apply rate limiting for non-API key requests
    if (!isApiKeyAuth) {
      const rateLimitCheck = checkRateLimit(ip);
      if (!rateLimitCheck.allowed) {
        return NextResponse.json(
          { 
            error: 'Rate limit exceeded', 
            resetInSeconds: rateLimitCheck.resetInSeconds,
            message: `Too many test API requests. Try again in ${rateLimitCheck.resetInSeconds} seconds.`
          },
          { 
            status: 429,
            headers: {
              'Retry-After': `${rateLimitCheck.resetInSeconds}`
            }
          }
        );
      }
    }

    console.log('[TEST API] Test endpoint called');
    console.log('[TEST API] IGDB credentials exist:', !!IGDB_CLIENT_ID && !!IGDB_CLIENT_SECRET);
    
    // Check for required credentials
    if (!IGDB_CLIENT_ID || !IGDB_CLIENT_SECRET) {
      console.error('[TEST API] IGDB credentials are missing');
      return NextResponse.json(
        { error: 'IGDB credentials are missing' },
        { status: 500 }
      );
    }
    
    // Get OAuth token for IGDB
    const tokenResponse = await fetch('https://id.twitch.tv/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: IGDB_CLIENT_ID,
        client_secret: IGDB_CLIENT_SECRET,
        grant_type: 'client_credentials',
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error(`Failed to get IGDB access token: ${tokenResponse.status}`);
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Get current date and date from 3 months ago (Unix timestamps)
    const now = new Date();
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(now.getMonth() - 3);
    
    const toDate = Math.floor(now.getTime() / 1000);
    const fromDate = Math.floor(threeMonthsAgo.getTime() / 1000);

    // Create IGDB query
    const igdbQuery = `
      fields id, name, cover.url, first_release_date, total_rating, total_rating_count,
             genres.name, platforms.name, summary;
      where first_release_date >= ${fromDate} & first_release_date <= ${toDate} 
            & total_rating_count >= 5;
      sort first_release_date desc;
      limit 20;
    `;
    
    console.log('[TEST API] Making IGDB API call');
    
    // Make the API call with cache disabled to ensure fresh results
    const response = await fetch(`${IGDB_BASE_URL}/games`, {
      method: 'POST',
      headers: {
        'Client-ID': IGDB_CLIENT_ID,
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: igdbQuery,
      cache: 'no-store'
    });
    
    if (!response.ok) {
      console.error(`[TEST API] IGDB API error: ${response.status} - ${response.statusText}`);
      const errorText = await response.text();
      console.error(`[TEST API] Error response body: ${errorText}`);
      throw new Error(`IGDB API error: ${response.status}`);
    }
    
    const results = await response.json();
    
    // Add debug information to the response
    const debugResults = {
      results: results,
      count: results.length,
      debug: {
        resultsCount: results.length || 0,
        credentialsExist: !!IGDB_CLIENT_ID && !!IGDB_CLIENT_SECRET,
        api: 'IGDB',
        query: igdbQuery.trim()
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