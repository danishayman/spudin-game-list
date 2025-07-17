/**
 * CORS utility for API routes
 * Provides secure, configurable CORS headers for your Next.js API routes
 */

export interface CorsOptions {
  origin?: string | string[] | boolean;
  methods?: string[];
  allowedHeaders?: string[];
  credentials?: boolean;
}

/**
 * Get allowed origins from environment variables and defaults
 */
export const getAllowedOrigins = (): string[] => {
  const defaultOrigins = [
    'http://localhost:3000', // Local development
    'https://localhost:3000', // Local development with HTTPS
  ];
  
  // Add origins from environment variable if available
  if (process.env.ALLOWED_CORS_ORIGINS) {
    const envOrigins = process.env.ALLOWED_CORS_ORIGINS.split(',').map(origin => origin.trim());
    defaultOrigins.push(...envOrigins);
  }
  
  // Add site URL if available
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    defaultOrigins.push(process.env.NEXT_PUBLIC_SITE_URL);
  }
  
  // Add current Vercel deployment URL
  if (process.env.VERCEL_URL) {
    defaultOrigins.push(`https://${process.env.VERCEL_URL}`);
  }
  
  // Fallback to common deployment patterns for this project
  const fallbackOrigins = [
    'https://spudin-game-list.vercel.app',
  ];
  
  return [...new Set([...defaultOrigins, ...fallbackOrigins])]; // Remove duplicates
};

/**
 * Check if an origin is allowed
 */
export const isOriginAllowed = (origin: string, allowedOrigins: string[]): boolean => {
  return allowedOrigins.includes(origin) ||
    allowedOrigins.some(allowed => 
      allowed.includes('*') && 
      origin.match(allowed.replace(/\*/g, '.*'))
    );
};

/**
 * Get CORS headers for a given origin
 */
export const getCorsHeaders = (
  requestOrigin?: string, 
  options: CorsOptions = {}
): Record<string, string> => {
  const {
    methods = ['GET', 'OPTIONS'],
    allowedHeaders = ['Content-Type', 'Authorization'],
    credentials = false
  } = options;
  
  const allowedOrigins = getAllowedOrigins();
  const origin = requestOrigin || '';
  const isAllowed = isOriginAllowed(origin, allowedOrigins);
  
  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': methods.join(', '),
    'Access-Control-Allow-Headers': allowedHeaders.join(', '),
    'Vary': 'Origin',
  };
  
  // Set origin - use requesting origin if allowed, otherwise use first allowed origin
  headers['Access-Control-Allow-Origin'] = isAllowed ? origin : allowedOrigins[0];
  
  // Add credentials header if needed
  if (credentials) {
    headers['Access-Control-Allow-Credentials'] = 'true';
  }
  
  return headers;
};

/**
 * Create a Response for OPTIONS (preflight) requests
 */
export const createOptionsResponse = (
  requestOrigin?: string, 
  options: CorsOptions = {}
): Response => {
  const headers = getCorsHeaders(requestOrigin, options);
  
  return new Response(null, {
    status: 200,
    headers,
  });
};

/**
 * Add CORS headers to a NextResponse
 */
export const addCorsHeaders = (
  response: Response, 
  requestOrigin?: string, 
  options: CorsOptions = {}
): void => {
  const headers = getCorsHeaders(requestOrigin, options);
  
  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
};
