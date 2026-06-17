# Firestore Integration Setup Guide

## Quick Setup Instructions

### 1. Verify Firebase Admin SDK Installation
Firebase Admin SDK is already installed in your project:
```bash
npm list firebase-admin
# Output: firebase-admin@14.0.0
```

### 2. Service Account Key
Ensure your `config/serviceAccountKey.json` file exists with your Firebase credentials:
- Download from Firebase Console → Project Settings → Service Accounts
- Click "Generate New Private Key"
- Save the JSON file as `config/serviceAccountKey.json`

### 3. Files Created
All files have been generated with production-ready code:

✅ **config/firebase.js** - Firebase Admin initialization
✅ **models/Client.js** - Firestore Client service
✅ **controllers/clientController.js** - API controllers
✅ **routes/clientRoutes.js** - API routes
✅ **server.js** - Updated with client routes

### 4. Start Your Server
```bash
npm start
# Server running on port 5000
```

### 5. Test the API

**Create a client:**
```bash
curl -X POST http://localhost:5000/api/clients \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Client",
    "email": "test@example.com",
    "phone": "+1234567890"
  }'
```

**Get all clients:**
```bash
curl http://localhost:5000/api/clients
```

## Environment Variables
Make sure your `.env` file contains:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/webnexa
```

## API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/clients` | Create a new client |
| GET | `/api/clients` | Get all clients |
| GET | `/api/clients/:id` | Get single client |
| PATCH | `/api/clients/:id/call-status` | Toggle call status |
| DELETE | `/api/clients/:id` | Delete client |
| GET | `/api/clients/filter/by-call-status` | Filter by call status |

For detailed API documentation, see [FIRESTORE_API_DOCUMENTATION.md](./FIRESTORE_API_DOCUMENTATION.md)

## Key Features

✨ **Production-Ready Code**
- Comprehensive error handling
- Input validation
- Email uniqueness checks
- Proper HTTP status codes

🔒 **Security**
- Input sanitization
- Email format validation
- Duplicate prevention
- Error messages don't leak sensitive info

📊 **Firestore Integration**
- Uses Firebase Admin SDK
- Firestore collection: `clients`
- Automatic timestamps
- Query flexibility with sorting/limiting

🚀 **Performance**
- Efficient Firestore queries
- Optional query pagination
- Indexed collections

## Troubleshooting

### "Cannot find module 'firebase-admin'"
```bash
npm install firebase-admin
```

### "Service account key not found"
- Verify file path: `config/serviceAccountKey.json`
- Check file contains valid JSON
- Ensure you have Firebase project credentials

### "Permission denied" in Firestore
- Check Firestore Security Rules in Firebase Console
- Ensure service account has proper permissions
- Verify authentication is configured

## Next Steps (Optional)

1. **Add authentication middleware** to protect endpoints
2. **Implement batch operations** for bulk client management
3. **Add audit logging** for compliance tracking
4. **Set up Cloud Functions** for automated processes
5. **Configure Firestore indexes** for complex queries
