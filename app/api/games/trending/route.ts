import { NextResponse } from 'next/server';
import { getTrendingGames } from '@/lib/igdb';

export async function GET() {
  try {
    const results = await getTrendingGames();
    return NextResponse.json(results);
  } catch (error) {
    console.error('Error fetching trending games:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trending games' },
      { status: 500 }
    );
  }
} 