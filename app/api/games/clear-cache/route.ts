import { NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';
import { CACHE_TYPE } from '@/lib/cache-utils';

// Add GET method that does the same thing as DELETE
export async function GET(request: Request) {
  return clearCache(request);
}

export async function DELETE(request: Request) {
  return clearCache(request);
}

// Refactor the cache clearing logic into a separate function
async function clearCache(request?: Request) {
  try {
    const supabase = createAdminClient();
    
    // Get query parameters if request is provided
    let cacheType = '';
    if (request) {
      const url = new URL(request.url);
      cacheType = url.searchParams.get('type') || '';
    }
    
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