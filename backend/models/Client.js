const { db } = require('../config/firebase');

const COLLECTION_NAME = 'clients';

class ClientService {
  static async createClient(clientData) {
    try {
      const { name, email, phone } = clientData;

      if (!name || !email || !phone) {
        throw new Error('Name, email, and phone are required');
      }

      const client = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        called: false,
        createdAt: new Date(),
      };

      const docRef = await db.collection(COLLECTION_NAME).add(client);
      return { id: docRef.id, ...client };
    } catch (error) {
      throw new Error(`Failed to create client: ${error.message}`);
    }
  }

  static async getAllClients(options = {}) {
    try {
      const { limit = 100, orderBy = 'createdAt', direction = 'desc' } = options;
      let query = db.collection(COLLECTION_NAME);
      if (orderBy) query = query.orderBy(orderBy, direction);
      if (limit) query = query.limit(limit);

      const snapshot = await query.get();
      if (snapshot.empty) return [];
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      throw new Error(`Failed to get clients: ${error.message}`);
    }
  }

  static async getClientById(clientId) {
    try {
      if (!clientId) throw new Error('Client ID is required');
      const doc = await db.collection(COLLECTION_NAME).doc(clientId).get();
      if (!doc.exists) return null;
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      throw new Error(`Failed to get client: ${error.message}`);
    }
  }

  static async updateCallStatus(clientId) {
    try {
      if (!clientId) throw new Error('Client ID is required');
      const clientRef = db.collection(COLLECTION_NAME).doc(clientId);
      const clientDoc = await clientRef.get();
      if (!clientDoc.exists) return null;

      const current = clientDoc.data().called || false;
      const updated = { called: !current, updatedAt: new Date() };
      await clientRef.update(updated);
      return { id: clientDoc.id, ...clientDoc.data(), ...updated };
    } catch (error) {
      throw new Error(`Failed to update call status: ${error.message}`);
    }
  }

  static async deleteClient(clientId) {
    try {
      if (!clientId) throw new Error('Client ID is required');
      const clientRef = db.collection(COLLECTION_NAME).doc(clientId);
      const clientDoc = await clientRef.get();
      if (!clientDoc.exists) return false;
      await clientRef.delete();
      return true;
    } catch (error) {
      throw new Error(`Failed to delete client: ${error.message}`);
    }
  }

  static async getClientsByCallStatus(called) {
    try {
      const baseQuery = db.collection(COLLECTION_NAME).where('called', '==', called);
      try {
        const snapshot = await baseQuery.orderBy('createdAt', 'desc').get();
        if (snapshot.empty) return [];
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      } catch (err) {
        // Fallback when composite index required
        const snapshot = await baseQuery.get();
        if (snapshot.empty) return [];
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      }
    } catch (error) {
      throw new Error(`Failed to get clients by call status: ${error.message}`);
    }
  }

  static async searchByEmail(email) {
    try {
      if (!email) throw new Error('Email is required');
      const snapshot = await db.collection(COLLECTION_NAME).where('email', '==', email.toLowerCase().trim()).get();
      if (snapshot.empty) return [];
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      throw new Error(`Failed to search clients by email: ${error.message}`);
    }
  }
}

module.exports = ClientService;
