/**
 * CORS middleware for API routes
 * Provides consistent, secure CORS handling across all API endpoints
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCorsHeaders, createOptionsResponse, CorsOptions } from '@/lib/utils/cors';

/**
 * Default CORS options for API routes
 */
const DEFAULT_CORS_OPTIONS: CorsOptions = {
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'Accept',
    'X-Requested-With',
    'X-CSRF-Token'
  ],
  credentials: true, // Allow credentials for authenticated requests
};

/**
 * Handle CORS for API routes
 * @param request - The incoming request
 * @param options - CORS configuration options
 * @returns Response with appropriate CORS headers or null if not OPTIONS
 */
export function handleCors(
  request: NextRequest, 
  options: Partial<CorsOptions> = {}
): Response | null {
  const origin = request.headers.get('origin');
  const corsOptions = { ...DEFAULT_CORS_OPTIONS, ...options };
  
  // Handle preflight OPTIONS requests
  if (request.method === 'OPTIONS') {
    return createOptionsResponse(origin || undefined, corsOptions);
  }
  
  return null; // Not an OPTIONS request, continue with normal processing
}

/**
 * Add CORS headers to a response
 * @param response - The response to add headers to
 * @param request - The original request (to get origin)
 * @param options - CORS configuration options
 */
export function addCorsToResponse(
  response: NextResponse,
  request: NextRequest,
  options: Partial<CorsOptions> = {}
): void {
  const origin = request.headers.get('origin');
  const corsOptions = { ...DEFAULT_CORS_OPTIONS, ...options };
  const corsHeaders = getCorsHeaders(origin || undefined, corsOptions);
  
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
}

/**
 * Wrapper for API route handlers that automatically handles CORS
 * @param handler - The API route handler function
 * @param options - CORS configuration options
 * @returns Wrapped handler with CORS support
 */
export function withCors(
  handler: (request: NextRequest) => Promise<Response>,
  options: Partial<CorsOptions> = {}
) {
  return async (request: NextRequest): Promise<Response> => {
    // Handle preflight requests
    const corsResponse = handleCors(request, options);
    if (corsResponse) {
      return corsResponse;
    }
    
    try {
      // Execute the original handler
      const response = await handler(request);
      
      // If it's already a NextResponse, just add CORS headers
      if (response instanceof NextResponse) {
        addCorsToResponse(response, request, options);
        return response;
      }
      
      // Otherwise, create a new NextResponse and add CORS headers
      const nextResponse = new NextResponse(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      });
      
      addCorsToResponse(nextResponse, request, options);
      return nextResponse;
    } catch (error) {
      // Handle errors and still add CORS headers
      const errorResponse = NextResponse.json(
        { 
          error: 'Internal Server Error',
          message: error instanceof Error ? error.message : 'Unknown error'
        },
        { status: 500 }
      );
      
      addCorsToResponse(errorResponse, request, options);
      return errorResponse;
    }
  };
}

/**
 * Simple CORS headers for manual addition to responses
 * @param request - The incoming request
 * @param options - CORS configuration options
 * @returns Object with CORS headers
 */
export function getCorsHeadersForResponse(
  request: NextRequest,
  options: Partial<CorsOptions> = {}
): Record<string, string> {
  const origin = request.headers.get('origin');
  const corsOptions = { ...DEFAULT_CORS_OPTIONS, ...options };
  return getCorsHeaders(origin || undefined, corsOptions);
}
