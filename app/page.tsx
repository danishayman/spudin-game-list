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
