import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';

const RAWG_API_KEY = process.env.RAWG_API_KEY;
const RAWG_BASE_URL = 'https://api.rawg.io/api';

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