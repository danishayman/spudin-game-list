import { NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';

export async function DELETE() {
  try {
    const supabase = createAdminClient();
    
    // Delete all entries from the game_cache table
    const { error } = await supabase
      .from('game_cache')
      .delete()
      .neq('cache_key', ''); // Delete all entries
    
    if (error) {
      console.error('Error clearing cache:', error);
      return NextResponse.json(
        { error: 'Failed to clear cache' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ message: 'Cache cleared successfully' });
  } catch (error) {
    console.error('Error clearing cache:', error);
    return NextResponse.json(
      { error: 'Failed to clear cache' },
      { status: 500 }
    );
  }
} 