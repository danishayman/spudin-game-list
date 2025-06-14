🔐 2. Auth Flow (Supabase + Google OAuth)
2.1 Create Supabase project and configure Google OAuth
Start: No backend

End: Supabase project ready, Google OAuth credentials added

2.2 Install Supabase client SDK
Start: No SDK installed

End: lib/supabaseClient.ts returns a working Supabase instance

2.3 Build login page (/login) with “Login with Google” button
Start: Blank login page

End: Button triggers Supabase signInWithOAuth('google')

2.4 Create and test AuthContext with session listener
Start: No context

End: AuthContext provides current user + login state

2.5 Implement route guard middleware (middleware.ts)
Start: Public access to all routes

End: Unauthenticated users are redirected to /login if accessing protected routes

👤 3. Basic User Profile Management
3.1 On successful login, insert new user into users table if not exists
Start: Login flow complete, DB empty

End: users table has record for logged-in user

3.2 Scaffold /dashboard page that greets user by name
Start: Empty dashboard

End: Page displays current user’s name from Supabase

3.3 Create /profile/[username] route
Start: No profile route

End: Hardcoded test user profile loads from users table

🎮 4. Game Discovery (RAWG API Integration)
4.1 Create RAWG API wrapper in lib/rawg.ts
Start: None

End: Function searchGames(query) fetches games from RAWG

4.2 Build game search bar UI with local component state
Start: No search bar

End: Typing in input calls searchGames and lists game results

4.3 Render results using <GameCard /> component
Start: No results UI

End: List of search results rendered with name + cover

🗃️ 5. Game Lists (CRUD MVP)
5.1 Create Supabase games and game_lists tables
Start: Only users exists

End: Tables created with correct foreign keys

5.2 On selecting a game from search, insert game into games table (if not exists)
Start: Game only in RAWG

End: Game stored locally with RAWG ID

5.3 Create “Add to My List” button with status selector (e.g., Playing)
Start: No interaction

End: game_lists gets upserted on button click

5.4 Create /dashboard list display (grouped by status)
Start: Empty dashboard

End: List of games fetched from game_lists and displayed under “Playing”, etc.

⭐ 6. Rating System
6.1 Add <RatingStars /> component with 1-10 stars
Start: No rating UI

End: User can select star rating (local state)

6.2 On rating change, update rating column in game_lists
Start: No backend update

End: Game record in game_lists updated with new rating

💬 7. Reviews & Comments
7.1 Create reviews table in Supabase
Start: Not in schema

End: Table created with id, user_id, game_id, content, created_at

7.2 Build review textarea + submit button on /game/[id]
Start: Static game page

End: Logged-in user can write and submit a review

7.3 Display all reviews for a game
Start: No display

End: List of reviews with author name and timestamp

🤝 8. Social Features
8.1 Create follows table
Start: Not in schema

End: follows created with follower_id, followee_id

8.2 Add “Follow” button on /profile/[username]
Start: Static profile

End: Clicking adds entry to follows

8.3 Build simple activity feed (/dashboard/activity)
Start: No feed

End: Shows recent actions (e.g., Aiman added a game, reviewed a title)

🧼 9. Filters, Sorting, UX Polish
9.1 Add dropdown to filter game list by status (e.g., only show Completed)
Start: Unfiltered list

End: UI filters based on selected status

9.2 Add sorting (e.g., by rating, alphabetical)
Start: Default order

End: User can select sort mode, updates list

9.3 Ensure mobile responsiveness (Tailwind breakpoints)
Start: Desktop only

End: App renders cleanly on mobile

📈 10. Analytics & Recommendation Seed
10.1 Add stats to /profile/[username] (e.g., total games, avg rating)
Start: Static profile

End: Displays calculated stats from game_lists

10.2 Recommend top-rated games in user’s preferred genre (mock logic)
Start: No recommendations

End: Recommend 3 games using hardcoded genre (test)