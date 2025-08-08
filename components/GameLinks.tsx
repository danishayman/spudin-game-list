import React from 'react';
import {
  FaGlobe,
  FaWikipediaW,
  FaFacebook,
  FaTwitter,
  FaTwitch,
  FaYoutube,
  FaInstagram,
  FaBlog,
  FaItchIo,
  FaReddit,
  FaAmazon,
  FaKickstarter,
  FaDiscord,
  FaGamepad,
  FaLink,
  FaStore,
} from 'react-icons/fa';
import {
  SiEpicgames,
  SiGogdotcom,
  SiPlaystation,
  SiSteam,
  SiNintendoswitch,
  SiBattledotnet,
  SiOrigin,
  SiUbisoft,
  SiApple,
  SiAndroid,
  SiBluesky
} from 'react-icons/si';

interface GameLink {
  id: number;
  category: number;
  url: string;
}

interface GameLinksProps {
  links: GameLink[];
}

// IGDB website category mapping (comprehensive mapping based on IGDB API documentation)
const categoryMapping = {
  1: { name: 'Official Website', icon: FaGlobe, color: 'text-blue-400' },
  2: { name: 'Wikia', icon: FaGlobe, color: 'text-green-400' },
  3: { name: 'Wikipedia', icon: FaWikipediaW, color: 'text-gray-300' },
  4: { name: 'Facebook', icon: FaFacebook, color: 'text-blue-500' },
  5: { name: 'Twitter', icon: FaTwitter, color: 'text-sky-400' },
  6: { name: 'Twitch', icon: FaTwitch, color: 'text-purple-500' },
  7: { name: 'Instagram Video', icon: FaInstagram, color: 'text-pink-500' },
  8: { name: 'Instagram', icon: FaInstagram, color: 'text-pink-500' },
  9: { name: 'YouTube', icon: FaYoutube, color: 'text-red-500' },
  10: { name: 'iPhone', icon: SiApple, color: 'text-gray-300' },
  11: { name: 'iPad', icon: SiApple, color: 'text-blue-400' },
  12: { name: 'Google Play', icon: SiAndroid, color: 'text-green-500' },
  13: { name: 'Steam', icon: SiSteam, color: 'text-blue-400' },
  14: { name: 'Reddit', icon: FaReddit, color: 'text-orange-500' },
  15: { name: 'Itch.io', icon: FaItchIo, color: 'text-red-400' },
  16: { name: 'Epic Games Store', icon: SiEpicgames, color: 'text-gray-300' },
  17: { name: 'GOG', icon: SiGogdotcom, color: 'text-purple-400' },
  18: { name: 'Discord', icon: FaDiscord, color: 'text-indigo-500' },
  19: { name: 'Bluesky', icon: SiBluesky, color: 'text-blue-400' },
} as const;

// Type for category info
type CategoryInfo = {
  name: string;
  icon: React.ComponentType<any>;
  color: string;
};

// Enhanced fallback function to determine appropriate icon based on URL
const getSmartFallback = (url: string, category: number): CategoryInfo => {
  const domain = url.toLowerCase();
  
  // Try to match common domains that might not be in our category mapping
  if (domain.includes('steam')) return { name: 'Steam', icon: SiSteam, color: 'text-blue-400' };
  if (domain.includes('epic') || domain.includes('epicgames')) return { name: 'Epic Games', icon: SiEpicgames, color: 'text-gray-300' };
  if (domain.includes('gog.com')) return { name: 'GOG', icon: SiGogdotcom, color: 'text-purple-400' };
  if (domain.includes('playstation') || domain.includes('sony')) return { name: 'PlayStation', icon: SiPlaystation, color: 'text-blue-600' };
  if (domain.includes('xbox') || domain.includes('microsoft')) return { name: 'Xbox/Microsoft', icon: FaGamepad, color: 'text-green-500' };
  if (domain.includes('nintendo')) return { name: 'Nintendo', icon: SiNintendoswitch, color: 'text-red-500' };
  if (domain.includes('origin') || domain.includes('ea.com')) return { name: 'Origin/EA', icon: SiOrigin, color: 'text-orange-500' };
  if (domain.includes('ubisoft') || domain.includes('uplay')) return { name: 'Ubisoft', icon: SiUbisoft, color: 'text-blue-500' };
  if (domain.includes('battle.net') || domain.includes('blizzard')) return { name: 'Battle.net', icon: SiBattledotnet, color: 'text-blue-500' };
  if (domain.includes('itch.io')) return { name: 'itch.io', icon: FaItchIo, color: 'text-red-400' };
  if (domain.includes('youtube')) return { name: 'YouTube', icon: FaYoutube, color: 'text-red-500' };
  if (domain.includes('twitch')) return { name: 'Twitch', icon: FaTwitch, color: 'text-purple-500' };
  if (domain.includes('twitter') || domain.includes('x.com')) return { name: 'Twitter/X', icon: FaTwitter, color: 'text-sky-400' };
  if (domain.includes('facebook')) return { name: 'Facebook', icon: FaFacebook, color: 'text-blue-500' };
  if (domain.includes('instagram')) return { name: 'Instagram', icon: FaInstagram, color: 'text-pink-500' };
  if (domain.includes('discord')) return { name: 'Discord', icon: FaDiscord, color: 'text-indigo-500' };
  if (domain.includes('reddit')) return { name: 'Reddit', icon: FaReddit, color: 'text-orange-500' };
  if (domain.includes('wikipedia')) return { name: 'Wikipedia', icon: FaWikipediaW, color: 'text-gray-300' };
  if (domain.includes('amazon')) return { name: 'Amazon', icon: FaAmazon, color: 'text-orange-400' };
  if (domain.includes('apple') || domain.includes('app-store') || domain.includes('appstore')) return { name: 'App Store', icon: SiApple, color: 'text-gray-300' };
  if (domain.includes('google') && domain.includes('play')) return { name: 'Google Play', icon: SiAndroid, color: 'text-green-500' };
  if (domain.includes('kickstarter')) return { name: 'Kickstarter', icon: FaKickstarter, color: 'text-green-400' };
  if (domain.includes('humble')) return { name: 'Humble Store', icon: FaStore, color: 'text-red-500' };
  if (domain.includes('store') || domain.includes('shop')) return { name: 'Store', icon: FaStore, color: 'text-blue-400' };
  if (domain.includes('blog') || domain.includes('news')) return { name: 'Blog/News', icon: FaBlog, color: 'text-gray-400' };
  
  // Default fallback with category info for debugging
  return { name: `Website (${category})`, icon: FaLink, color: 'text-gray-400' };
};

const defaultCategory: CategoryInfo = { name: 'Website', icon: FaGlobe, color: 'text-gray-400' };

const GameLinks: React.FC<GameLinksProps> = ({ links }) => {
  if (!links || links.length === 0) {
    return null;
  }

  // Filter out invalid links
  const validLinks = links.filter(link => 
    link && 
    typeof link.id === 'number' && 
    typeof link.category === 'number' && 
    typeof link.url === 'string' && 
    link.url.trim().length > 0
  );

  if (validLinks.length === 0) {
    return null;
  }

  // Debug logging to see actual category numbers
  console.log('GameLinks received links:', validLinks.map(link => ({ id: link.id, category: link.category, url: link.url })));

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-white mb-4">Links</h3>
      <div className="grid grid-cols-5 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-1 sm:gap-2">
        {validLinks.map((link) => {
          // Try to get the category from our mapping first
          let category: CategoryInfo = categoryMapping[link.category as keyof typeof categoryMapping] || getSmartFallback(link.url, link.category);
          
          // Log the mapping result
          if (categoryMapping[link.category as keyof typeof categoryMapping]) {
            console.log(`Link ${link.id}: category ${link.category} -> ${category.name}`);
          } else {
            console.log(`Unknown category ${link.category} for URL ${link.url}, using smart fallback: ${category.name}`);
          }
          
          const IconComponent = category.icon;
          
          return (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center p-1.5 sm:p-3 bg-gray-800 hover:bg-gray-700 rounded-md sm:rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg border border-gray-700 hover:border-gray-600 aspect-square"
              title={`Visit ${category.name}: ${link.url}`}
            >
              <div className={`${category.color} group-hover:scale-110 transition-transform duration-200`}>
                <IconComponent size={20} className="sm:w-7 sm:h-7" />
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default GameLinks;

// Sample usage:
/*
import GameLinks from '@/components/GameLinks';

const ExampleUsage = () => {
  const sampleLinks = [
    { id: 1, category: 1, url: 'https://example.com' }, // Official Website
    { id: 2, category: 24, url: 'https://store.steampowered.com/app/123456' }, // Steam
    { id: 3, category: 8, url: 'https://youtube.com/watch?v=example' }, // YouTube
    { id: 4, category: 5, url: 'https://twitter.com/example' }, // Twitter
    { id: 5, category: 23, url: 'https://store.playstation.com/example' }, // PlayStation Store
    { id: 6, category: 22, url: 'https://marketplace.xbox.com/example' }, // Xbox Marketplace
  ];

  return (
    <div className="bg-gray-900 min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <GameLinks links={sampleLinks} />
      </div>
    </div>
  );
};
*/