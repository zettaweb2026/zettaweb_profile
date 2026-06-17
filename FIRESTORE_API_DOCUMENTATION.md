# Firestore Client Management API

This document describes the Firestore integration for the Node.js/Express backend, including setup and API endpoints.

## Setup

### Prerequisites
- Firebase Admin SDK (`firebase-admin`) - already installed
- Service account key JSON file at `config/serviceAccountKey.json`

### Files Created

1. **config/firebase.js** - Firebase Admin SDK initialization
2. **models/Client.js** - Firestore Client service with CRUD operations
3. **controllers/clientController.js** - API controllers with validation and error handling
4. **routes/clientRoutes.js** - API route definitions
5. **server.js** - Updated to register client routes

### Firebase Collection Schema

**Collection:** `clients`

**Document fields:**
```json
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "called": "boolean",
  "createdAt": "timestamp",
  "updatedAt": "timestamp (optional)"
}
```

---

## API Endpoints

### Base URL
```
/api/clients
```

---

### 1. Create Client
**Endpoint:** `POST /api/clients`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890"
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "Client created successfully",
  "data": {
    "id": "documentId123",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "called": false,
    "createdAt": "2024-06-17T10:30:00Z"
  }
}
```

**Error Responses:**
- `400` - Missing required fields (name, email, phone)
- `400` - Invalid email format
- `409` - Client with email already exists
- `500` - Server error

---

### 2. Get All Clients
**Endpoint:** `GET /api/clients`

**Query Parameters:**
- `limit` (optional, default: 100, max: 1000) - Number of clients to retrieve
- `orderBy` (optional, default: 'createdAt') - Field to sort by
- `direction` (optional, default: 'desc') - Sort direction ('asc' or 'desc')

**Example Request:**
```
GET /api/clients?limit=50&orderBy=createdAt&direction=desc
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Clients retrieved successfully",
  "count": 2,
  "data": [
    {
      "id": "documentId123",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "called": false,
      "createdAt": "2024-06-17T10:30:00Z"
    },
    {
      "id": "documentId456",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "phone": "+0987654321",
      "called": true,
      "createdAt": "2024-06-16T14:20:00Z"
    }
  ]
}
```

**Error Responses:**
- `400` - Invalid limit or direction parameter
- `500` - Server error

---

### 3. Get Single Client
**Endpoint:** `GET /api/clients/:id`

**Path Parameters:**
- `id` - Firestore document ID

**Example Request:**
```
GET /api/clients/documentId123
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Client retrieved successfully",
  "data": {
    "id": "documentId123",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "called": false,
    "createdAt": "2024-06-17T10:30:00Z"
  }
}
```

**Error Responses:**
- `400` - Missing client ID
- `404` - Client not found
- `500` - Server error

---

### 4. Update Call Status (Toggle)
**Endpoint:** `PATCH /api/clients/:id/call-status`

**Path Parameters:**
- `id` - Firestore document ID

**Description:** Toggles the `called` field. If `called` is `false`, it becomes `true`, and vice versa.

**Example Request:**
```
PATCH /api/clients/documentId123/call-status
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Call status updated successfully",
  "data": {
    "id": "documentId123",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "called": true,
    "createdAt": "2024-06-17T10:30:00Z",
    "updatedAt": "2024-06-17T11:45:00Z"
  }
}
```

**Error Responses:**
- `400` - Missing client ID
- `404` - Client not found
- `500` - Server error

---

### 5. Delete Client
**Endpoint:** `DELETE /api/clients/:id`

**Path Parameters:**
- `id` - Firestore document ID

**Example Request:**
```
DELETE /api/clients/documentId123
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Client deleted successfully"
}
```

**Error Responses:**
- `400` - Missing client ID
- `404` - Client not found
- `500` - Server error

---

### 6. Filter Clients by Call Status
**Endpoint:** `GET /api/clients/filter/by-call-status`

**Query Parameters:**
- `called` (required) - Boolean filter ('true' or 'false')

**Example Requests:**
```
GET /api/clients/filter/by-call-status?called=true
GET /api/clients/filter/by-call-status?called=false
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Clients retrieved successfully",
  "count": 1,
  "data": [
    {
      "id": "documentId123",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "called": true,
      "createdAt": "2024-06-17T10:30:00Z"
    }
  ]
}
```

**Error Responses:**
- `400` - Missing 'called' parameter
- `500` - Server error

---

## Features & Validation

### Input Validation
- **Name:** Required, trimmed
- **Email:** Required, valid email format, unique (no duplicates)
- **Phone:** Required, trimmed
- **Call Status:** Boolean toggle (true/false)

### Error Handling
- Comprehensive try-catch blocks in all controllers
- Descriptive error messages
- Appropriate HTTP status codes:
  - `201` - Created successfully
  - `200` - Success
  - `400` - Bad request/validation error
  - `404` - Not found
  - `409` - Conflict (duplicate email)
  - `500` - Server error

### Additional Features
- Email uniqueness validation
- Call status toggle (not set, but toggle)
- Optional sorting and limiting for list operations
- Search clients by email
- Filter clients by call status
- Timestamps for creation and updates

---

## Usage Examples

### cURL Examples

**Create a client:**
```bash
curl -X POST http://localhost:5000/api/clients \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","phone":"+1234567890"}'
```

**Get all clients:**
```bash
curl http://localhost:5000/api/clients
```

**Toggle call status:**
```bash
curl -X PATCH http://localhost:5000/api/clients/documentId123/call-status
```

**Delete a client:**
```bash
curl -X DELETE http://localhost:5000/api/clients/documentId123
```

**Filter by called status:**
```bash
curl http://localhost:5000/api/clients/filter/by-call-status?called=true
```

---

## Firebase Firestore Tips

### Querying Performance
- Firestore composite indexes are automatically created for common queries
- For complex queries, Firestore will suggest index creation
- Limit queries with `limit()` to reduce read operations and costs

### Best Practices
1. Always validate input on the backend
2. Use timestamps for audit trails
3. Implement proper pagination with Firestore cursors for large datasets
4. Monitor Firestore costs (read/write/delete operations)
5. Use batch writes for bulk operations

### Security Rules (Firebase Console)
For production, configure Firestore Security Rules:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /clients/{clientId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## Troubleshooting

### Issue: "Service account key not found"
**Solution:** Ensure `config/serviceAccountKey.json` exists and contains valid credentials from Firebase Console.

### Issue: "Permission denied" errors
**Solution:** Check Firestore Security Rules in Firebase Console. Ensure your auth middleware and security rules are configured correctly.

### Issue: Slow query performance
**Solution:** Add composite indexes for common queries (Firestore will suggest these automatically).

---

## Next Steps

1. Implement authentication middleware for client endpoints (optional)
2. Add pagination cursors for large datasets
3. Implement bulk operations (batch create/delete)
4. Add audit logging for all operations
5. Implement rate limiting for API endpoints
