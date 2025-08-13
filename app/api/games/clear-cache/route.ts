import { NextResponse } from 'next/server';
import { createAdminClient } from '@/supabase/admin';
import { CACHE_TYPE } from '@/lib/utils/cacheUtils';
import { createClient } from '@/supabase/server';

// Simple in-memory rate limiting
// In production, consider using a distributed solution like Redis
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour window
const MAX_REQUESTS_PER_WINDOW = 5; // 5 requests per hour
const ipRequestMap = new Map<string, { count: number, timestamp: number }>();

// Add GET method that does the same thing as DELETE
export async function GET(request: Request) {
  return clearCache(request);
}

export async function DELETE(request: Request) {
  return clearCache(request);
}

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

// Refactor the cache clearing logic into a separate function
async function clearCache(request?: Request) {
  try {
    if (!request) {
      return NextResponse.json(
        { error: 'Request object is required' },
        { status: 400 }
      );
    }
    
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
          console.log('Authorized via API key');
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
      console.log('Authorized via admin user');
    }
    
    // Apply rate limiting for non-API key requests
    if (!isApiKeyAuth) {
      const rateLimitCheck = checkRateLimit(ip);
      if (!rateLimitCheck.allowed) {
        return NextResponse.json(
          { 
            error: 'Rate limit exceeded', 
            resetInSeconds: rateLimitCheck.resetInSeconds,
            message: `Too many cache clear requests. Try again in ${rateLimitCheck.resetInSeconds} seconds.`
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
    
    // Continue with cache clearing if authorized
    const supabase = createAdminClient();
    
    // Get query parameters
    const url = new URL(request.url);
    const cacheType = url.searchParams.get('type') || '';
    
    let query = supabase.from('game_cache').delete();
    
    if (cacheType && Object.values(CACHE_TYPE).includes(cacheType)) {
      // Clear specific cache type
      query = query.eq('cache_type', cacheType);
      console.log(`Clearing cache for type: ${cacheType}`);
    } else {
      // Clear all cache
      query = query.neq('cache_key', ''); // Delete all entries
      console.log('Clearing all cache');
    }
    
    const { error, count } = await query;
    
    if (error) {
      console.error('Error clearing cache:', error);
      return NextResponse.json(
        { error: 'Failed to clear cache' },
        { status: 500 }
      );
    }
    
    const message = cacheType 
      ? `Cache cleared successfully for type: ${cacheType}` 
      : 'All cache cleared successfully';
      
    return NextResponse.json({ 
      message,
      clearedEntries: count || 0,
      cacheType: cacheType || 'all'
    });
  } catch (error) {
    console.error('Error clearing cache:', error);
    return NextResponse.json(
      { error: 'Failed to clear cache' },
      { status: 500 }
    );
  }
} 