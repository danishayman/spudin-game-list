import { ImageResponse } from 'next/og';
import { createClient } from '@/utils/supabase/server';
 
export const runtime = 'edge';
 
export const alt = 'Game collection profile';
export const size = {
  width: 1200,
  height: 630,
};
 
export const contentType = 'image/png';
 
export default async function Image({ params }: { params: { username: string } }) {
  const username = decodeURIComponent(params.username);
  const supabase = await createClient();
  
  // Fetch the profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single();
  
  // Fetch game count
  const { data: gameCount } = await supabase
    .from('game_lists')
    .select('game_id', { count: 'exact' })
    .eq('user_id', profile?.id || '');
  
  const totalGames = gameCount?.length || 0;
  const displayName = profile?.username || username;
  const avatarUrl = profile?.avatar_url || '';
  
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to bottom, #1e293b, #0f172a)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
          }}
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={displayName}
              width={120}
              height={120}
              style={{
                borderRadius: '50%',
                marginRight: '20px',
              }}
            />
          ) : (
            <div
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                backgroundColor: '#475569',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '20px',
                fontSize: '48px',
                fontWeight: 'bold',
                color: '#f8fafc',
              }}
            >
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}
          
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h1
              style={{
                fontSize: '48px',
                fontWeight: 'bold',
                color: 'white',
                margin: '0',
              }}
            >
              {displayName}
            </h1>
            <p
              style={{
                fontSize: '24px',
                color: '#94a3b8',
                margin: '0',
              }}
            >
              @{username}
            </p>
          </div>
        </div>
        
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            padding: '12px 24px',
            borderRadius: '8px',
            marginTop: '20px',
          }}
        >
          <p
            style={{
              fontSize: '24px',
              color: 'white',
              margin: '0',
            }}
          >
            {totalGames} {totalGames === 1 ? 'Game' : 'Games'} in Collection
          </p>
        </div>
        
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <p
            style={{
              fontSize: '20px',
              color: '#94a3b8',
              margin: '0',
            }}
          >
            Spudin Game List
          </p>
        </div>
      </div>
    ),
    { ...size }
  );
} 