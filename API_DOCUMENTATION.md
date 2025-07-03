# Log Ingestion and Querying System - API Documentation

This document outlines the API endpoints for the Log Ingestion and Querying System. The API is built with Node.js and Express, using file-based storage for simplicity and ease of deployment.

## Base URL
```
http://localhost:5001/api
```

> **Note:** The default port is 5001, but this can be configured via the `PORT` environment variable.

## Authentication
No authentication is required for development. For production use, consider adding API key authentication.

## Rate Limiting
To prevent abuse, the API implements rate limiting:
- **Log Creation**: Limited to 100 requests per minute per IP
- **Log Queries**: Limited to 300 requests per minute per IP

Rate limit headers are included in all responses:
- `X-RateLimit-Limit`: Maximum allowed requests in the current window
- `X-RateLimit-Remaining`: Requests remaining in the current window
- `X-RateLimit-Reset`: Seconds until the rate limit resets

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "status": 400,
  "message": "Validation error message"
}
```

### 404 Not Found
```json
{
  "success": false,
  "status": 404,
  "message": "Resource not found"
}
```

### 429 Too Many Requests
```json
{
  "success": false,
  "status": 429,
  "message": "Too many requests, please try again later."
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "status": 500,
  "message": "Internal server error"
}
```

---

## Endpoints

### 1. Health Check

Check if the API is running.

**URL**: `/health`  
**Method**: `GET`  
**Rate Limit**: None

#### Response
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

---

### 2. Create Log Entry

Create a new log entry.

**URL**: `/logs`  
**Method**: `POST`  
**Rate Limit**: 5 requests per minute per IP

#### Request Body
```json
{
  "level": "error",
  "message": "Failed to connect to database",
  "resourceId": "server-1234",
  "timestamp": "2023-09-15T08:00:00Z",
  "traceId": "abc-xyz-123",
  "spanId": "span-456",
  "commit": "5e5342f",
  "metadata": {
    "parentResourceId": "server-0987"
  }
}
```

#### Field Descriptions
```json
{
  "success": true,
  "data": {
    "_id": "5f8d5d4b5e4b5e2d1c7e3d2a",
    "level": "error",
    "message": "Failed to connect to database",
    "resourceId": "server-1234",
    "timestamp": "2023-11-15T08:15:30.000Z",
    "traceId": "abc-xyz-123",
    "spanId": "span-456",
    "commit": "5e5342f",
    "metadata": {
      "parentResourceId": "server-0987"
    }
  }
}
```

### 2. Search Logs
Query logs with advanced filtering and pagination.

```http
GET /logs
```

**Query Parameters**

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `level` | string | Filter by log level | `error`, `warn`, `info`, `debug` |
| `message` | string | Full-text search in log messages | `database timeout` |
| `resourceId` | string | Filter by resource ID | `server-1234` |
| `traceId` | string | Filter by trace ID | `abc-xyz-123` |
| `spanId` | string | Filter by span ID | `span-456` |
| `commit` | string | Filter by commit hash | `5e5342f` |
| `parentResourceId` | string | Filter by parent resource ID | `server-0987` |
| `startDate` | ISO 8601 | Filter logs after this timestamp | `2023-11-15T08:00:00Z` |
| `endDate` | ISO 8601 | Filter logs before this timestamp | `2023-11-15T23:59:59Z` |
| `limit` | number | Items per page (default: 10, max: 100) | `25` |
| `page` | number | Page number (starts at 1) | `2` |

**Example Request**
```
GET /logs?level=error&resourceId=server-1234&startDate=2023-11-15T00:00:00Z&limit=25&page=1
```

**Response (200 OK)**
```json
{
  "success": true,
  "data": [
    {
      "_id": "5f8d5d4b5e4b5e2d1c7e3d2a",
      "level": "error",
      "message": "Failed to connect to database",
      "resourceId": "server-1234",
      "timestamp": "2023-11-15T08:15:30.000Z"
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

### 3. Get Log by ID
Retrieve a specific log entry by its unique ID.

```http
GET /logs/:id
```

**Response (200 OK)**
```json
{
  "success": true,
  "data": {
    "_id": "5f8d5d4b5e4b5e2d1c7e3d2a",
    "level": "error",
    "message": "Failed to connect to database",
    "resourceId": "server-1234",
    "timestamp": "2023-11-15T08:15:30.000Z",
    "traceId": "abc-xyz-123",
    "spanId": "span-456",
    "commit": "5e5342f",
    "metadata": {
      "parentResourceId": "server-0987"
    }
  }
}
```

**Response (404 Not Found)**
```json
{
  "success": false,
  "status": 404,
  "message": "Log not found with id: 5f8d5d4b5e4b5e2d1c7e3d2a"
}
```

## Example Usage

### Using cURL

1. **Create a log entry**:
```bash
curl -X POST http://localhost:5000/api/logs \
  -H "Content-Type: application/json" \
  -d '{
    "level": "error",
    "message": "Failed to connect to database",
    "resourceId": "server-1234",
    "timestamp": "2023-11-15T08:15:30Z",
    "traceId": "abc-xyz-123",
    "spanId": "span-456",
    "commit": "5e5342f",
    "metadata": {
      "parentResourceId": "server-0987"
    }
  }'
```

2. **Query logs**:
```bash
curl "http://localhost:5000/api/logs?level=error&resourceId=server-1234&startDate=2023-11-15T00:00:00Z&limit=25&page=1"
```

## Response Headers

- `X-RateLimit-Limit`: Maximum number of requests allowed in the current period
- `X-RateLimit-Remaining`: Number of requests remaining in the current period
- `X-RateLimit-Reset`: Time at which the current rate limit window resets (Unix timestamp)
- `Retry-After`: Number of seconds to wait before making a new request (only present when rate limited)
