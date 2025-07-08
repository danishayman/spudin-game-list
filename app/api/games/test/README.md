# Test API Endpoint

This endpoint is for admin use only and provides diagnostic information about the RAWG API integration.

## Security

The endpoint is secured using two authentication methods:

1. **Admin User Authentication**: Only authenticated users with the `is_admin` flag set to `true` in their profile can access this endpoint.

2. **API Key Authentication**: For automated scripts or server-to-server communication, you can use an API key.

## Rate Limiting

To prevent abuse, the endpoint implements rate limiting:

- **Limit**: 10 requests per hour per IP address
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

- **URL**: `/api/games/test`
- **Methods**: GET
- **Parameters**: None

### Response

The endpoint returns diagnostic information about the RAWG API, including:

```json
{
  "count": 123,
  "next": "https://api.rawg.io/api/games?page=2&page_size=20",
  "previous": null,
  "results": [...],
  "debug": {
    "resultsCount": 20,
    "pageSize": "20",
    "apiKeyExists": true,
    "url": "https://api.rawg.io/api/games?key=[API_KEY]&dates=2023-01-01,2023-04-01&ordering=-added&page_size=20&ratings_count=5"
  }
}
```

### Error Responses

#### Unauthorized (401)
```json
{
  "error": "Unauthorized: Authentication required"
}
```

#### Forbidden (403)
```json
{
  "error": "Forbidden: Admin privileges required"
}
```

#### Rate Limit Exceeded (429)
```json
{
  "error": "Rate limit exceeded",
  "resetInSeconds": 3540,
  "message": "Too many test API requests. Try again in 3540 seconds."
}
```

## Environment Setup

Add the following to your `.env` file:

```
ADMIN_API_KEY=your-secure-random-api-key
```

## Database Setup

Ensure the `is_admin` column exists in the profiles table:

```sql
-- Add is_admin column to profiles table if it doesn't exist
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;
``` 