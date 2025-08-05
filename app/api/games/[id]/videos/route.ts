import { NextResponse } from "next/server";

// For dynamic route segments, we need to access the params directly
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // First await the params object itself
        const resolvedParams = await params;
        const gameId = parseInt(resolvedParams.id);

        if (isNaN(gameId)) {
            return NextResponse.json({ error: "Invalid game ID" }, { status: 400 });
        }

        // IGDB includes videos in the main game data when requested with "videos.*" field
        // The main getGameById function in our IGDB wrapper already includes videos
        // For now, return an empty array as videos are included in the main game details
        console.log(`[IGDB] Videos are included in main game details for game ID: ${gameId}`);
        
        // Return empty result for now - videos are included in the main game endpoint
        const videosData = {
            count: 0,
            next: null,
            previous: null,
            results: []
        };
        
        return NextResponse.json(videosData);
    } catch (error) {
        console.error("Error fetching game videos:", error);
        return NextResponse.json(
            { error: "Failed to fetch game videos" },
            { status: 500 }
        );
    }
} 