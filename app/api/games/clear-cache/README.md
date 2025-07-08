# Cache Clearing API Endpoint

This endpoint allows administrators to clear the game cache data stored in the database.

## Security

The endpoint is secured using two authentication methods:

1. **Admin User Authentication**: Only authenticated users with the `is_admin` flag set to `true` in their profile can access this endpoint.

2. **API Key Authentication**: For automated scripts or server-to-server communication, you can use an API key.

## Rate Limiting

To prevent abuse, the endpoint implements rate limiting:

- **Limit**: 5 requests per hour per IP address
- **Exemptions**: Requests authenticated with the API key are exempt from rate limiting
- **Response**: When rate limited, the API returns a 429 status code with a `Retry-After` header

## Usage

### Authentication Methods

#### Method 1: Admin User Session

Log in as an admin user and access the endpoint. The session cookie will be used for authentication.

#### Method 2: API Key

Send a request with the `Authorization` header:

```
Authorization: Bearer YOUR_ADMIN_API_KEY
```

### Endpoint Details

- **URL**: `/api/games/clear-cache`
- **Methods**: GET, DELETE
- **Query Parameters**:
  - `type` (optional): Specify a cache type to clear only that type. Valid values are:
    - `search`
    - `game_details`
    - `trending`
    - `new_releases`
  - If no type is provided, all cache will be cleared.

### Examples

#### Clear all cache:
```
GET /api/games/clear-cache
```

#### Clear only search cache:
```
GET /api/games/clear-cache?type=search
```

### Response

#### Successful Response
```json
{
  "message": "All cache cleared successfully",
  "clearedEntries": 42,
  "cacheType": "all"
}
```

#### Rate Limit Exceeded
```json
{
  "error": "Rate limit exceeded",
  "resetInSeconds": 3540,
  "message": "Too many cache clear requests. Try again in 3540 seconds."
}
```

## Environment Setup

Add the following to your `.env` file:

```
ADMIN_API_KEY=your-secure-random-api-key
```

## Database Setup

Run the SQL migration to add the `is_admin` column to the profiles table:

```sql
-- Add is_admin column to profiles table
ALTER TABLE profiles ADD COLUMN is_admin BOOLEAN DEFAULT FALSE;

-- Create index for faster lookups
CREATE INDEX idx_profiles_is_admin ON profiles(is_admin);
```

## Setting Admin Users

To set a user as admin, update their profile in the database:

```sql
UPDATE profiles SET is_admin = TRUE WHERE id = 'user-uuid';
```

## Production Considerations

1. The current implementation uses in-memory rate limiting, which won't work across multiple instances. For production, consider:
   - Using Redis for distributed rate limiting
   - Implementing a more robust solution with a database

2. Secure the API key with proper secret management:
   - Use environment variables
   - Rotate the key periodically
   - Consider using a secret manager service 