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

        const RAWG_API_KEY = process.env.RAWG_API_KEY;
        if (!RAWG_API_KEY) {
            return NextResponse.json({ error: "API key not configured" }, { status: 500 });
        }

        // Get game series data
        const url = new URL(`https://api.rawg.io/api/games/${gameId}/game-series`);
        url.searchParams.append('key', RAWG_API_KEY);
        
        const response = await fetch(url.toString(), { 
            next: { revalidate: 3600 } // Cache for 1 hour
        });
        
        if (!response.ok) {
            return NextResponse.json(
                { error: `RAWG API error: ${response.status}` },
                { status: response.status }
            );
        }
        
        const seriesData = await response.json();
        return NextResponse.json(seriesData);
    } catch (error) {
        console.error("Error fetching game series:", error);
        return NextResponse.json(
            { error: "Failed to fetch game series" },
            { status: 500 }
        );
    }
} 