'use client';

import { SearchDialog } from '../common/SearchDialog';

export function GameExplorerHero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-purple-950/40 to-slate-900 py-16 md:py-24">
      {/* Background elements */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute top-10 left-1/4 w-64 h-64 bg-purple-500 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-10 right-1/4 w-64 h-64 bg-blue-500 rounded-full filter blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Discover Your Next Gaming Adventure
          </h1>
          <p className="text-xl text-slate-300 mb-8">
            Explore over 300,000 games across all platforms, from indie gems to AAA blockbusters
          </p>
          
          <div className="flex justify-center mb-8">
            <SearchDialog 
              buttonVariant="default" 
              buttonText="Search Games" 
              triggerClassName="bg-purple-600 hover:bg-purple-700 text-white py-6 px-8 rounded-lg font-medium text-lg"
              buttonIcon={true}
            />
          </div>

          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <div className="bg-slate-800/70 border border-slate-700 rounded-full px-4 py-2 text-sm text-slate-300">
              <span className="font-semibold text-purple-400">300,000+</span> Games
            </div>
            <div className="bg-slate-800/70 border border-slate-700 rounded-full px-4 py-2 text-sm text-slate-300">
              <span className="font-semibold text-purple-400">50+</span> Platforms
            </div>
            <div className="bg-slate-800/70 border border-slate-700 rounded-full px-4 py-2 text-sm text-slate-300">
              <span className="font-semibold text-purple-400">Daily</span> Updates
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 