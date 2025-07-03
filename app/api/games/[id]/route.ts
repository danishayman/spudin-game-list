import { NextResponse } from 'next/server';
import { getGameById } from '@/lib/rawg';

// For dynamic route segments, we need to access the params directly
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // First await the params object itself
    const resolvedParams = await params;
    const gameId = parseInt(resolvedParams.id);
    
    if (isNaN(gameId)) {
      return NextResponse.json(
        { error: 'Invalid game ID' },
        { status: 400 }
      );
    }

    const game = await getGameById(gameId);
    return NextResponse.json(game);
  } catch (error) {
    console.error('Error fetching game details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch game details' },
      { status: 500 }
    );
  }
} 