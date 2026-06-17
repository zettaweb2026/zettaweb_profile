const { db } = require('../config/firebase');

const COLLECTION_NAME = 'clients';

/**
 * Client Service for Firestore operations
 */
class ClientService {
  /**
   * Create a new client
   * @param {Object} clientData - Client data
   * @returns {Promise<Object>} Created client with ID
   */
  static async createClient(clientData) {
    try {
      const { name, email, phone } = clientData;

      // Validation
      if (!name || !email || !phone) {
        throw new Error('Name, email, and phone are required');
      }

      // Prepare client document
      const client = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        called: false,
        createdAt: new Date(),
      };

      // Add to Firestore
      const docRef = await db.collection(COLLECTION_NAME).add(client);

      return {
        id: docRef.id,
        ...client,
      };
    } catch (error) {
      throw new Error(`Failed to create client: ${error.message}`);
    }
  }

  /**
   * Get all clients
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of clients
   */
  static async getAllClients(options = {}) {
    try {
      const { limit = 100, orderBy = 'createdAt', direction = 'desc' } = options;

      let query = db.collection(COLLECTION_NAME);

      // Apply orderBy
      query = query.orderBy(orderBy, direction);

      // Apply limit
      query = query.limit(limit);

      const snapshot = await query.get();

      if (snapshot.empty) {
        return [];
      }

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      throw new Error(`Failed to get clients: ${error.message}`);
    }
  }

  /**
   * Get a single client by ID
   * @param {string} clientId - Client document ID
   * @returns {Promise<Object>} Client data
   */
  static async getClientById(clientId) {
    try {
      if (!clientId) {
        throw new Error('Client ID is required');
      }

      const doc = await db.collection(COLLECTION_NAME).doc(clientId).get();

      if (!doc.exists) {
        return null;
      }

      return {
        id: doc.id,
        ...doc.data(),
      };
    } catch (error) {
      throw new Error(`Failed to get client: ${error.message}`);
    }
  }

  /**
   * Update call status (toggle called field)
   * @param {string} clientId - Client document ID
   * @returns {Promise<Object>} Updated client data
   */
  static async updateCallStatus(clientId) {
    try {
      if (!clientId) {
        throw new Error('Client ID is required');
      }

      const clientRef = db.collection(COLLECTION_NAME).doc(clientId);
      const clientDoc = await clientRef.get();

      if (!clientDoc.exists) {
        return null;
      }

      const currentStatus = clientDoc.data().called || false;
      const newStatus = !currentStatus;

      await clientRef.update({
        called: newStatus,
        updatedAt: new Date(),
      });

      return {
        id: clientDoc.id,
        ...clientDoc.data(),
        called: newStatus,
        updatedAt: new Date(),
      };
    } catch (error) {
      throw new Error(`Failed to update call status: ${error.message}`);
    }
  }

  /**
   * Delete a client
   * @param {string} clientId - Client document ID
   * @returns {Promise<boolean>} Success status
   */
  static async deleteClient(clientId) {
    try {
      if (!clientId) {
        throw new Error('Client ID is required');
      }

      const clientRef = db.collection(COLLECTION_NAME).doc(clientId);
      const clientDoc = await clientRef.get();

      if (!clientDoc.exists) {
        return false;
      }

      await clientRef.delete();
      return true;
    } catch (error) {
      throw new Error(`Failed to delete client: ${error.message}`);
    }
  }

  /**
   * Get clients by call status
   * @param {boolean} called - Filter by called status
   * @returns {Promise<Array>} Array of filtered clients
   */
  static async getClientsByCallStatus(called) {
    try {
      const query = db.collection(COLLECTION_NAME).where('called', '==', called);
      let snapshot;

      try {
        snapshot = await query.orderBy('createdAt', 'desc').get();
      } catch (error) {
        // Firestore may require a composite index for this query.
        if (
          error.code === 9 ||
          /requires an index/i.test(error.message || '') ||
          /FAILED_PRECONDITION/i.test(error.message || '')
        ) {
          snapshot = await query.get();
        } else {
          throw error;
        }
      }

      if (snapshot.empty) {
        return [];
      }

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      throw new Error(`Failed to get clients by call status: ${error.message}`);
    }
  }

  /**
   * Search clients by email
   * @param {string} email - Email to search
   * @returns {Promise<Array>} Array of matching clients
   */
  static async searchByEmail(email) {
    try {
      if (!email) {
        throw new Error('Email is required');
      }

      const snapshot = await db
        .collection(COLLECTION_NAME)
        .where('email', '==', email.toLowerCase().trim())
        .get();

      if (snapshot.empty) {
        return [];
      }

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      throw new Error(`Failed to search clients by email: ${error.message}`);
    }
  }
}

module.exports = ClientService;
