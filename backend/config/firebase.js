const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');
const path = require('path');
const fs = require('fs');

// Load service account key from environment variables
const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
  universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN
};

if (!serviceAccount.project_id || !serviceAccount.private_key || !serviceAccount.client_email) {
  throw new Error('Firebase service account keys are missing from environment variables');
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
