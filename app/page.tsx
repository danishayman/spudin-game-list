import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Game {
  id: number;
  name: string;
  background_image: string;
  released: string;
  genres: { name: string }[];
  rating: number;
  metacritic: number | null;
}

// Function to fetch new releases with decent ratings
async function getNewReleases(): Promise<Game[]> {
  try {
    // For server components, we need to use an absolute URL
    // This handles both local development and production
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
      
    const response = await fetch(`${baseUrl}/api/games/new-releases`, {
      next: { revalidate: 3600 } // Revalidate every hour
    });
    
    if (!response.ok) {
      console.error('Failed to fetch new releases: Response not OK');
      return [];
    }
    const data = await response.json();
    console.log('New releases data:', JSON.stringify(data).substring(0, 200) + '...');
    console.log('Number of results:', data.results?.length || 0);
    return data.results?.slice(0, 10) || [];
  } catch (error) {
    console.error('Failed to fetch new releases:', error);
    return [];
  }
}

// Fallback games in case API fails
const fallbackGames: Game[] = [
  {
    id: 1,
    name: "The Last Journey",
    background_image: "/landing/banner.jpg",
    released: "2023-05-01",
    genres: [{ name: "Action" }, { name: "Adventure" }],
    rating: 4.5,
    metacritic: 85
  },
  {
    id: 2,
    name: "Mystic Chronicles",
    background_image: "/landing/discover.png",
    released: "2023-04-15",
    genres: [{ name: "RPG" }, { name: "Strategy" }],
    rating: 4.2,
    metacritic: 80
  },
  {
    id: 3,
    name: "Battle Legends",
    background_image: "/landing/track.png",
    released: "2023-03-22",
    genres: [{ name: "Shooter" }, { name: "Action" }],
    rating: 4.0,
    metacritic: 75
  }
];

export default async function Home() {
  let newReleases = await getNewReleases();
  
  // Use fallback games if no results from API
  if (!newReleases || newReleases.length === 0) {
    console.log('Using fallback games');
    newReleases = fallbackGames;
  }

  return (
    <main className="flex min-h-screen flex-col bg-slate-900 text-white pt-0">
      {/* Hero Section with Banner */}
      <div className="relative h-[65vh] w-full">
        <Image
          src="/landing/banner.jpg"
          alt="Spudin's Game List Banner"
          fill
          priority
          className="object-cover brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900" />
        
        {/* Hero Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
            Spudin&apos;s Game List
          </h1>
          <p className="text-xl md:text-2xl max-w-2xl mb-8 drop-shadow-md">
            Track, discover, and share your favorite games with the gaming community
          </p>
          <div className="flex gap-4">
            <Link href="/home">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg">
                Get Started
              </Button>
            </Link>
            <Link href="/games">
              <Button variant="outline" className="bg-white/10 backdrop-blur-sm border-white/30 text-white px-8 py-6 text-lg hover:bg-white/20">
                Browse Games
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* New Releases Section */}
      <div className="py-16 px-4 ">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-8">
            <h2 className="text-3xl font-bold">New Releases</h2>
          </div>
          
          <div className="relative">
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
              {newReleases.map((game: Game) => (
                <Link
                  key={game.id}
                  href={`/games/${game.id}`}
                  className="flex-shrink-0 group"
                >
                  <div className="bg-slate-700 rounded-lg overflow-hidden w-64 transition-transform group-hover:scale-105">
                    <div className="relative h-36">
                      {game.background_image ? (
                        <Image
                          src={game.background_image}
                          alt={game.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-slate-600 flex items-center justify-center">
                          <span className="text-slate-400 text-sm">No Image</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-sm mb-1 truncate">{game.name}</h3>
                      <p className="text-slate-400 text-xs mb-2">
                        {game.genres?.map((g: { name: string }) => g.name).join(', ') || 'Various Genres'}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">
                          {game.released ? new Date(game.released).getFullYear() : 'TBA'}
                        </span>
                        {game.metacritic && (
                          <span className={`text-xs px-1.5 py-0.5 rounded font-bold ${
                            game.metacritic >= 75 ? 'bg-green-700' : 
                            game.metacritic >= 60 ? 'bg-yellow-600' : 'bg-red-700'
                          }`}>
                            {game.metacritic}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto py-16 px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-slate-800 p-6 rounded-lg overflow-hidden">
          <div className="relative h-48 mb-6 rounded-lg overflow-hidden">
            <Image
              src="/landing/track.png"
              alt="Track Your Games"
              fill
              className="object-cover"
            />
          </div>
          <h2 className="text-xl font-bold mb-2">Track Your Games</h2>
          <p className="text-slate-300">Keep a personal collection of games you&apos;ve played, are playing, or want to play.</p>
        </div>
        
        <div className="bg-slate-800 p-6 rounded-lg overflow-hidden">
          <div className="relative h-48 mb-6 rounded-lg overflow-hidden">
            <Image
              src="/landing/discover.png"
              alt="Discover New Games"
              fill
              className="object-cover"
            />
          </div>
          <h2 className="text-xl font-bold mb-2">Discover New Games</h2>
          <p className="text-slate-300">Find trending and popular games across all platforms and genres.</p>
        </div>
        
        <div className="bg-slate-800 p-6 rounded-lg overflow-hidden">
          <div className="relative h-48 mb-6 rounded-lg overflow-hidden">
            <Image
              src="/landing/review.png"
              alt="Share Your Reviews"
              fill
              className="object-cover"
            />
          </div>
          <h2 className="text-xl font-bold mb-2">Share Your Reviews</h2>
          <p className="text-slate-300">Write reviews and share your gaming experiences with the community.</p>
        </div>
      </div>

      {/* Community Section */}
      <div className="bg-slate-800 py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Join Our Gaming Community</h2>
          <p className="text-xl text-slate-300 mb-12 max-w-3xl mx-auto">
            Connect with fellow gamers, share your gaming experiences, and discover new titles to play.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
            <a 
              href="https://discord.gg/gaming" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-lg transition-colors flex items-center justify-center gap-3 text-lg font-semibold"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.995a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418Z"/>
              </svg>
              Join Discord
            </a>
            
            <a 
              href="https://twitch.tv/bexed" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg transition-colors flex items-center justify-center gap-3 text-lg font-semibold"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
              </svg>
              Watch Stream
            </a>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      {/* <div className="bg-gradient-to-r from-purple-700 to-indigo-800 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Gaming Journey?</h2>
          <p className="text-xl mb-8">Join thousands of gamers tracking and sharing their gaming experiences.</p>
          <div className="flex justify-center gap-4">
            <LoginButton />
          </div>
        </div>
      </div> */}

      {/* Footer */}
      <footer className="bg-slate-950 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-slate-400">© {new Date().getFullYear()} Spudin&apos;s Game List</p>
          </div>
          <div className="flex gap-4">
          </div>
        </div>
      </footer>
    </main>
  );
}
