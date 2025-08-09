import { ImageResponse } from 'next/og';
import { getGameById } from '@/lib/services/igdb';

export const alt = 'Game Details';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  try {
    // First await the params object itself
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    const game = await getGameById(id);
    
    // Function to determine metacritic color
    const getMetacriticColor = (score: number) => {
      if (score >= 75) return '#4ade80'; // green
      if (score >= 50) return '#facc15'; // yellow
      return '#ef4444'; // red
    };
    
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            background: 'linear-gradient(to bottom, rgba(30, 27, 75, 0.9), rgba(15, 23, 42, 0.95))',
            width: '100%',
            height: '100%',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            position: 'relative',
            padding: '40px',
          }}
        >
          {/* Background image with overlay */}
          {game.background_image && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: `url(${game.background_image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: 0.4,
                zIndex: -1,
              }}
            />
          )}
          
          {/* Spudin Game List Logo/Text */}
          <div
            style={{
              position: 'absolute',
              top: 40,
              left: 40,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: 'white',
              }}
            >
              Spudin Game List
            </div>
          </div>
          
          {/* Game information */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              zIndex: 1,
            }}
          >
            <h1
              style={{
                fontSize: '72px',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '16px',
                textShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
              }}
            >
              {game.name}
            </h1>
            
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '16px',
              }}
            >
              {game.released && (
                <div
                  style={{
                    fontSize: '28px',
                    color: 'white',
                    opacity: 0.9,
                    padding: '8px 16px',
                    borderRadius: '8px',
                    background: 'rgba(0, 0, 0, 0.4)',
                  }}
                >
                  Released: {new Date(game.released).getFullYear()}
                </div>
              )}
              
              {game.rating && (
                <div
                  style={{
                    fontSize: '28px',
                    color: 'white',
                    opacity: 0.9,
                    padding: '8px 16px',
                    borderRadius: '8px',
                    background: 'rgba(0, 0, 0, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <span style={{ color: '#facc15' }}>★</span>
                  {game.rating.toFixed(1)}
                </div>
              )}
              
              {game.metacritic && (
                <div
                  style={{
                    fontSize: '28px',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    background: getMetacriticColor(game.metacritic),
                    fontWeight: 'bold',
                  }}
                >
                  Metacritic: {game.metacritic}
                </div>
              )}
            </div>
            
            {/* Genres */}
            {game.genres && game.genres.length > 0 && (
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px',
                }}
              >
                {game.genres.slice(0, 4).map((genre: { id: number; name: string }, index: number) => (
                  <div
                    key={index}
                    style={{
                      fontSize: '20px',
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '16px',
                      background: 'rgba(79, 70, 229, 0.6)',
                    }}
                  >
                    {genre.name}
                  </div>
                ))}
              </div>
            )}
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