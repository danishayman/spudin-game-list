// IGDB OAuth Authentication Handler
// Manages token lifecycle and API authentication

import { IGDB_CONFIG } from './config';
import { IgdbTokenResponse } from './types';

// OAuth token management
let accessToken: string | null = null;
let tokenExpiry: number = 0;

/**
 * Get OAuth access token for IGDB API
 * Handles token caching and renewal automatically
 */
export async function getAccessToken(): Promise<string> {
  // Check if we have a valid token
  if (accessToken && Date.now() < tokenExpiry) {
    return accessToken;
  }

  if (!IGDB_CONFIG.CLIENT_ID || !IGDB_CONFIG.CLIENT_SECRET) {
    throw new Error('IGDB Client ID and Client Secret are required');
  }

  console.log('[IGDB Auth] Requesting new access token');

  const response = await fetch(IGDB_CONFIG.OAUTH_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: IGDB_CONFIG.CLIENT_ID,
      client_secret: IGDB_CONFIG.CLIENT_SECRET,
      grant_type: 'client_credentials',
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to get IGDB access token: ${response.status} - ${errorText}`);
  }

  const data: IgdbTokenResponse = await response.json();
  accessToken = data.access_token;
  tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000; // Refresh 1 minute early

  console.log('[IGDB Auth] Successfully obtained new access token');
  return accessToken!;
}

/**
 * Clear the cached token (useful for testing or error recovery)
 */
export function clearToken(): void {
  accessToken = null;
  tokenExpiry = 0;
  console.log('[IGDB Auth] Cleared cached token');
}

/**
 * Check if current token is valid (not expired)
 */
export function isTokenValid(): boolean {
  return accessToken !== null && Date.now() < tokenExpiry;
}
