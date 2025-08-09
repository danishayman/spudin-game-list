import { NextRequest, NextResponse } from 'next/server';
import { getPublicProfile } from '@/lib/actions/profileActions';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    const profileData = await getPublicProfile(username);
    
    if (!profileData) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    // Return public profile data for API consumption
    const publicData = {
      username: profileData.username,
      avatarUrl: profileData.avatar_url,
      stats: {
        totalGames: profileData.stats.totalGames,
        gamesFinished: profileData.stats.gamesFinished,
        gamesPlaying: profileData.stats.gamesPlaying,
        averageRating: profileData.stats.averageRating,
        totalReviews: profileData.stats.totalReviews,
        recentActivity: profileData.stats.recentActivity
      }
    };

    return NextResponse.json(publicData, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
      }
    });
  } catch (error) {
    console.error('Error in profile API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
