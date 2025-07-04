import LoginButton from "@/components/LoginLogoutButton";
import UserGreetText from "@/components/UserGreetText";
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
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/games/new-releases`, {
      cache: 'no-store'
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
    <main className="flex min-h-screen flex-col bg-slate-900 text-white">
      {/* Hero Section with Banner */}
      <div className="relative h-[70vh] w-full">
        <Image
          src="/landing/banner.jpg"
          alt="Spudin's Game List Banner"
          fill
          priority
          className="object-cover brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900" />
        
        {/* Hero Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-end px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
            Spudin's Game List
          </h1>
          <p className="text-xl md:text-2xl max-w-2xl mb-8 drop-shadow-md">
            Track, discover, and share your favorite games with the gaming community
          </p>
          <div className="flex gap-4">
            <Link href="/dashboard">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg">
                Get Started
              </Button>
            </Link>
            <Link href="/games">
              <Button variant="outline" className="border-black text-black px-8 py-6 text-lg">
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
          <p className="text-slate-300">Keep a personal collection of games you've played, are playing, or want to play.</p>
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
              alt="Share Your Thoughts"
              fill
              className="object-cover"
            />
          </div>
          <h2 className="text-xl font-bold mb-2">Share Your Thoughts</h2>
          <p className="text-slate-300">Rate games and share your reviews with the community.</p>
        </div>
      </div>

      {/* Community Section */}
      <div className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Gaming Community</h2>
          <p className="text-xl text-slate-300 mb-8">
            Connect with fellow gamers, watch live streams, and stay up to date with the latest gaming discussions
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <a 
              href="https://discord.gg/bexed" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-lg transition-colors flex items-center justify-center gap-3 text-lg font-semibold"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0002 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9460 2.4189-2.1568 2.4189Z"/>
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
      <div className="bg-gradient-to-r from-purple-700 to-indigo-800 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Gaming Journey?</h2>
          <p className="text-xl mb-8">Join thousands of gamers tracking and sharing their gaming experiences.</p>
          <div className="flex justify-center gap-4">
            <LoginButton />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-950 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-slate-400">© {new Date().getFullYear()} Spudin's Game List</p>
          </div>
          <div className="flex gap-4">
            <UserGreetText />
          </div>
        </div>
      </footer>
    </main>
  );
}
