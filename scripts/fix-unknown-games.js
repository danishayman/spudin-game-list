// Script to fix "Unknown Game" entries in the database
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fetch = require('node-fetch'); // Add this import for Node.js

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('Starting fix-unknown-games script...');
console.log(`Supabase URL: ${supabaseUrl ? 'Found' : 'Missing'}`);
console.log(`Supabase Service Key: ${supabaseServiceKey ? 'Found' : 'Missing'}`);

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

// RAWG API configuration
const RAWG_API_KEY = process.env.RAWG_API_KEY;
console.log(`RAWG API Key: ${RAWG_API_KEY ? 'Found' : 'Missing'}`);

if (!RAWG_API_KEY) {
  console.error('Missing RAWG API key');
  process.exit(1);
}

// Create Supabase client with service role key for admin access
const supabase = createClient(supabaseUrl, supabaseServiceKey);
console.log('Supabase client created');

async function getGameFromRawg(gameId) {
  try {
    console.log(`Fetching game ${gameId} from RAWG API...`);
    const url = `https://api.rawg.io/api/games/${gameId}?key=${RAWG_API_KEY}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`RAWG API error: ${response.status}`);
    }
    
    const gameData = await response.json();
    console.log(`Successfully fetched game data for ID ${gameId}: ${gameData.name}`);
    return {
      id: gameData.id,
      name: gameData.name,
      background_image: gameData.background_image,
      released: gameData.released,
      rating: gameData.rating
    };
  } catch (error) {
    console.error(`Error fetching game ${gameId} from RAWG:`, error);
    return null;
  }
}

async function fixUnknownGames() {
  try {
    // Step 1: First check for games with null or empty names
    console.log('Finding games with null or empty names...');
    const { data: emptyNameGames, error: emptyNameError } = await supabase
      .from('games')
      .select('id, name')
      .or('name.is.null,name.eq.');
    
    if (emptyNameError) {
      console.error('Error finding games with empty names:', emptyNameError);
    } else {
      console.log(`Found ${emptyNameGames?.length || 0} games with null or empty names`);
      
      // Process these games
      if (emptyNameGames && emptyNameGames.length > 0) {
        for (const game of emptyNameGames) {
          console.log(`Processing game with empty name, ID: ${game.id}`);
          
          // Fetch game data from RAWG API
          const gameData = await getGameFromRawg(game.id);
          
          if (!gameData) {
            console.log(`Skipping game ID ${game.id} - could not fetch data from RAWG`);
            continue;
          }
          
          // Update the game in the database
          console.log(`Updating game ${game.id} in database with name: ${gameData.name}`);
          const { error: updateError } = await supabase
            .from('games')
            .update({
              name: gameData.name,
              background_image: gameData.background_image,
              released: gameData.released,
              rating: gameData.rating
            })
            .eq('id', game.id);
          
          if (updateError) {
            console.error(`Error updating game ${game.id}:`, updateError);
          } else {
            console.log(`Successfully updated game ${game.id}: ${gameData.name}`);
          }
        }
      }
    }
    
    // Step 2: Find game entries in game_lists that have missing game details
    console.log('Finding game list entries with missing game details...');
    const { data: missingGames, error: missingGamesError } = await supabase
      .from('game_lists')
      .select(`
        game_id,
        games (id, name)
      `)
      .is('games.name', null);
    
    if (missingGamesError) {
      console.error('Error finding games with missing details:', missingGamesError);
      throw missingGamesError;
    }
    
    if (!missingGames || missingGames.length === 0) {
      console.log('No games with missing details found in game lists.');
      return;
    }
    
    console.log(`Found ${missingGames.length} games with missing details in game lists.`);
    console.log('Game IDs:', missingGames.map(g => g.game_id).join(', '));
    
    // Step 3: Fetch and update each missing game
    for (const entry of missingGames) {
      const gameId = entry.game_id;
      console.log(`Processing game ID: ${gameId}`);
      
      // Fetch game data from RAWG API
      const gameData = await getGameFromRawg(gameId);
      
      if (!gameData) {
        console.log(`Skipping game ID ${gameId} - could not fetch data from RAWG`);
        continue;
      }
      
      // Update the game in the database
      console.log(`Updating game ${gameId} in database:`, gameData.name);
      const { error: updateError } = await supabase
        .from('games')
        .update({
          name: gameData.name,
          background_image: gameData.background_image,
          released: gameData.released,
          rating: gameData.rating
        })
        .eq('id', gameId);
      
      if (updateError) {
        console.error(`Error updating game ${gameId}:`, updateError);
      } else {
        console.log(`Successfully updated game ${gameId}: ${gameData.name}`);
      }
    }
    
    console.log('Fix completed successfully!');
  } catch (error) {
    console.error('Error fixing unknown games:', error);
  }
}

// Run the fix
fixUnknownGames()
  .then(() => {
    console.log('Script completed');
    process.exit(0);
  })
  .catch(error => {
    console.error('Script failed:', error);
    process.exit(1);
  }); 