import { createClient } from '@/utils/supabase/server';
import { Metadata } from 'next';
import { getUserGameStatsByUsername } from '@/lib/game-actions';

export async function generateMetadata({
  params,
}: {
  params: { username: string };
}): Promise<Metadata> {
  const username = decodeURIComponent(params.username);
  const supabase = await createClient();
  
  // Fetch the profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single();
    
  if (!profile) {
    return {
      title: 'Profile Not Found',
    };
  }
  
  // Fetch game stats
  const gameStats = await getUserGameStatsByUsername(username);
  const totalGames = gameStats.counts.Total || 0;
  
  const displayName = profile.username || username;
  
  return {
    title: `${displayName}'s Game Collection | Spudin Game List`,
    description: `Check out ${displayName}'s collection of ${totalGames} games on Spudin Game List.`,
    openGraph: {
      title: `${displayName}'s Game Collection | Spudin Game List`,
      description: `Check out ${displayName}'s collection of ${totalGames} games on Spudin Game List.`,
      url: `/profile/${encodeURIComponent(username)}`,
      siteName: 'Spudin Game List',
      images: [
        {
          url: `/profile/${encodeURIComponent(username)}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: `${displayName}'s game collection`,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${displayName}'s Game Collection | Spudin Game List`,
      description: `Check out ${displayName}'s collection of ${totalGames} games on Spudin Game List.`,
      images: [`/profile/${encodeURIComponent(username)}/opengraph-image`],
    },
  };
} 