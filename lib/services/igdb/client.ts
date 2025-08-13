// IGDB API HTTP Client
// Low-level HTTP communication with IGDB API

import { getAccessToken } from './auth';
import { IGDB_CONFIG} from './config';
import { IgdbRawGame } from '../../../types/api/igdb';

/**
 * Make authenticated request to IGDB API
 * Handles authentication and basic error handling
 */
export async function makeIgdbRequest(endpoint: string, query: string): Promise<IgdbRawGame[]> {
  const token = await getAccessToken();

  console.log(`[IGDB Client] Making request to ${endpoint} with query:`, query);

  const response = await fetch(`${IGDB_CONFIG.BASE_URL}/${endpoint}`, {
    method: 'POST',
    headers: {
      'Client-ID': IGDB_CONFIG.CLIENT_ID!,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'text/plain',
    },
    body: query,
    next: { cache: 'no-store' }
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[IGDB Client] API error ${response.status}:`, errorText);
    throw new Error(`IGDB API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  console.log(`[IGDB Client] Successfully received ${Array.isArray(data) ? data.length : 0} results from ${endpoint}`);
  
  return data;
}

/**
 * Build IGDB query string with common fields
 */
export function buildQuery(specificFields: string[], conditions?: string, limit?: number, sort?: string): string {
  const baseFields = ['id', 'name'];
  const allFields = [...new Set([...baseFields, ...specificFields])];
  
  let query = `fields ${allFields.join(', ')};`;
  
  if (conditions) {
    query += ` ${conditions};`;
  }
  
  if (sort) {
    query += ` sort ${sort};`;
  }
  
  if (limit) {
    query += ` limit ${limit};`;
  }
  
  return query;
}
