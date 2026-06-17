const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');
const path = require('path');
const fs = require('fs');

// Load service account key
const serviceAccountKeyPath = path.join(__dirname, 'serviceAccountKey.json');

if (!fs.existsSync(serviceAccountKeyPath)) {
  throw new Error(`Service account key not found at ${serviceAccountKeyPath}`);
}

let serviceAccount;
try {
  serviceAccount = require('./serviceAccountKey.json');
} catch (error) {
  throw new Error(`Failed to load service account key: ${error.message}`);
}

// Initialize Firebase Admin SDK
if (admin.getApps().length === 0) {
  admin.initializeApp({
    credential: admin.cert(serviceAccount),
  });
}

// Get Firestore database instance
const db = getFirestore();

// Enable offline persistence in development
if (process.env.NODE_ENV !== 'production') {
  db.settings({
    ignoreUndefinedProperties: true,
  });
}

module.exports = {
  admin,
  db,
};
