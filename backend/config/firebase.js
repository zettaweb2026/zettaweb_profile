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

const hasFirebaseCredentials = serviceAccount.project_id && serviceAccount.private_key && serviceAccount.client_email;

let db;

if (!hasFirebaseCredentials) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Firebase service account keys are missing from environment variables in production');
  } else {
    console.warn('⚠️ Firebase credentials missing. Initializing local JSON Firestore Mock for client leads.');
    db = createFirestoreMock();
  }
} else {
  // Initialize Firebase Admin SDK (idempotent)
  if (typeof admin.getApps === 'function' ? admin.getApps().length === 0 : true) {
    admin.initializeApp({
      credential: admin.cert(serviceAccount),
    });
  }
  
  // Firestore client
  db = getFirestore();
  
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
}

function createFirestoreMock() {
  const mockFilePath = path.join(__dirname, '../mock_clients.json');
  
  const readData = () => {
    try {
      if (fs.existsSync(mockFilePath)) {
        return JSON.parse(fs.readFileSync(mockFilePath, 'utf8'));
      }
    } catch (err) {
      console.error('Error reading Firestore mock data:', err);
    }
    return [];
  };

  const writeData = (data) => {
    try {
      fs.writeFileSync(mockFilePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (err) {
      console.error('Error writing Firestore mock data:', err);
    }
  };

  if (!fs.existsSync(mockFilePath)) {
    writeData([
      {
        id: 'mock-client-1',
        companyName: 'Acme Corp',
        email: 'acme@example.com',
        phone: '123-456-7890',
        status: 'Not Received',
        createdAt: new Date().toISOString()
      },
      {
        id: 'mock-client-2',
        companyName: 'Globex Corp',
        email: 'globex@example.com',
        phone: '987-654-3210',
        status: 'In Discussion',
        createdAt: new Date(Date.now() - 86400000).toISOString()
      }
    ]);
  }

  class MockQuery {
    constructor(data, filters = [], orderByField = null, orderDirection = 'desc', limitVal = null) {
      this.data = data;
      this.filters = filters;
      this.orderByField = orderByField;
      this.orderDirection = orderDirection;
      this.limitVal = limitVal;
    }

    where(field, operator, value) {
      return new MockQuery(
        this.data,
        [...this.filters, { field, operator, value }],
        this.orderByField,
        this.orderDirection,
        this.limitVal
      );
    }

    orderBy(field, direction = 'desc') {
      return new MockQuery(
        this.data,
        this.filters,
        field,
        direction,
        this.limitVal
      );
    }

    limit(val) {
      return new MockQuery(
        this.data,
        this.filters,
        this.orderByField,
        this.orderDirection,
        val
      );
    }

    async get() {
      let result = [...this.data];
      
      for (const filter of this.filters) {
        if (filter.operator === '==') {
          result = result.filter(item => {
            const itemVal = item[filter.field];
            const filterVal = filter.value;
            return typeof itemVal === 'string' && typeof filterVal === 'string'
              ? itemVal.toLowerCase() === filterVal.toLowerCase()
              : itemVal === filterVal;
          });
        }
      }

      if (this.orderByField) {
        result.sort((a, b) => {
          const valA = a[this.orderByField];
          const valB = b[this.orderByField];
          if (valA < valB) return this.orderDirection === 'asc' ? -1 : 1;
          if (valA > valB) return this.orderDirection === 'asc' ? 1 : -1;
          return 0;
        });
      }

      if (this.limitVal !== null && this.limitVal !== undefined) {
        result = result.slice(0, this.limitVal);
      }

      const docs = result.map(item => ({
        id: item.id,
        data: () => {
          const copy = { ...item };
          delete copy.id;
          return copy;
        }
      }));

      return {
        empty: docs.length === 0,
        docs
      };
    }
  }

  return {
    collection: (collectionName) => {
      return {
        add: async (client) => {
          const data = readData();
          const id = 'mock-' + Math.random().toString(36).substr(2, 9);
          const newDoc = {
            id,
            ...client,
            createdAt: client.createdAt instanceof Date ? client.createdAt.toISOString() : (client.createdAt || new Date().toISOString())
          };
          data.push(newDoc);
          writeData(data);
          return { id };
        },

        doc: (clientId) => {
          return {
            get: async () => {
              const data = readData();
              const item = data.find(d => d.id === clientId);
              return {
                exists: !!item,
                id: clientId,
                data: () => {
                  if (!item) return undefined;
                  const copy = { ...item };
                  delete copy.id;
                  return copy;
                }
              };
            },
            update: async (updated) => {
              const data = readData();
              const index = data.findIndex(d => d.id === clientId);
              if (index !== -1) {
                const normUpdated = { ...updated };
                if (normUpdated.updatedAt instanceof Date) {
                  normUpdated.updatedAt = normUpdated.updatedAt.toISOString();
                }
                data[index] = { ...data[index], ...normUpdated };
                writeData(data);
              }
            },
            delete: async () => {
              let data = readData();
              data = data.filter(d => d.id !== clientId);
              writeData(data);
            }
          };
        },

        where: (field, operator, value) => {
          const data = readData();
          return new MockQuery(data).where(field, operator, value);
        },

        orderBy: (field, direction = 'desc') => {
          const data = readData();
          return new MockQuery(data).orderBy(field, direction);
        },

        limit: (val) => {
          const data = readData();
          return new MockQuery(data).limit(val);
        },

        get: async () => {
          const data = readData();
          return new MockQuery(data).get();
        }
      };
    }
  };
}

module.exports = {
  admin,
  db,
};
