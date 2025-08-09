import { NextResponse } from "next/server";
import { getGameSeriesById } from "@/lib/services/igdb";

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

        console.log(`[IGDB] Fetching game series for game ID: ${gameId}`);
        
        const seriesData = await getGameSeriesById(gameId);
        
        return NextResponse.json(seriesData);
    } catch (error) {
        console.error("Error fetching game series:", error);
        return NextResponse.json(
            { error: "Failed to fetch game series" },
            { status: 500 }
        );
    }
} 