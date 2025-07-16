import { type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match specific routes that need authentication:
     * - /profile/* (user profiles)
     * - /settings/* (user settings)
     * - /my-games/* (user's game lists)
     * - /api/reviews/* (user reviews API)
     * - /api/debug/* (debug endpoints)
     * Exclude all other API routes and static files
     */
    '/profile/:path*',
    '/settings/:path*', 
    '/my-games/:path*',
    '/api/reviews/:path*',
    '/api/debug/:path*'
  ],
}