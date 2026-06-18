const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');
const path = require('path');
const fs = require('fs');

// Load service account key (kept out of source control in production)
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

// Initialize Firebase Admin SDK (idempotent)
if (typeof admin.getApps === 'function' ? admin.getApps().length === 0 : true) {
  admin.initializeApp({
    credential: admin.cert(serviceAccount),
  });
}

// Firestore client
const db = getFirestore();

// Helpful default settings for development
if (process.env.NODE_ENV !== 'production' && typeof db.settings === 'function') {
  try {
    db.settings({
      ignoreUndefinedProperties: true,
    });
  } catch (e) {
    // Non-fatal: some environments or versions may not need explicit settings
    console.warn('Failed to apply Firestore settings:', e.message);
  }
}

module.exports = {
  admin,
  db,
};
