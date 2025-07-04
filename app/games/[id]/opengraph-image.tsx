import { ImageResponse } from 'next/og';
import { getGameById } from '@/lib/rawg';

export const alt = 'Game Details';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image({ params }: { params: { id: string } }) {
  try {
    // First await the params object itself
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    const game = await getGameById(id);
    
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            background: 'linear-gradient(to bottom, #4f46e5, #1e1b4b)',
            width: '100%',
            height: '100%',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '40px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '40px',
            }}
          >
            <h1
              style={{
                fontSize: '60px',
                fontWeight: 'bold',
                color: 'white',
                textAlign: 'center',
              }}
            >
              {game.name}
            </h1>
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: '30px',
              color: 'white',
              opacity: 0.8,
            }}
          >
            {game.released ? `Released: ${new Date(game.released).getFullYear()}` : ''}
            {game.rating ? ` • Rating: ${game.rating.toFixed(1)}` : ''}
          </div>
        </div>
      ),
      {
        ...size,
      }
    );
  } catch {
    // Fallback image
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            background: 'linear-gradient(to bottom, #4f46e5, #1e1b4b)',
            width: '100%',
            height: '100%',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '40px',
          }}
        >
          <h1
            style={{
              fontSize: '60px',
              fontWeight: 'bold',
              color: 'white',
              textAlign: 'center',
            }}
          >
            Game Details
          </h1>
          <p
            style={{
              fontSize: '30px',
              color: 'white',
              opacity: 0.8,
              marginTop: '20px',
            }}
          >
            Spudin Game List
          </p>
        </div>
      ),
      {
        ...size,
      }
    );
  }
} 