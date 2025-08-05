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

        // IGDB doesn't have a direct "game series" endpoint like RAWG
        // We'll need to search for games with similar names or from the same franchise
        // For now, return an empty array as this feature needs to be reimplemented
        console.log(`[IGDB] Game series endpoint not yet implemented for game ID: ${gameId}`);
        
        // Return empty result for now - this would need to be implemented using IGDB's
        // collection or franchise endpoints
        const seriesData = {
            count: 0,
            next: null,
            previous: null,
            results: []
        };
        
        return NextResponse.json(seriesData);
    } catch (error) {
        console.error("Error fetching game series:", error);
        return NextResponse.json(
            { error: "Failed to fetch game series" },
            { status: 500 }
        );
    }
} 