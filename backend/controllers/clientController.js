const ClientService = require('../models/Client');

/**
 * Create a new client
 * POST /api/clients
 */
exports.createClient = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    // Input validation
    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and phone are required',
      });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format',
      });
    }

    // Check if email already exists
    const existingClients = await ClientService.searchByEmail(email);
    if (existingClients.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Client with this email already exists',
      });
    }

    const client = await ClientService.createClient({
      name,
      email,
      phone,
    });

    return res.status(201).json({
      success: true,
      message: 'Client created successfully',
      data: client,
    });
  } catch (error) {
    console.error('Error creating client:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to create client',
    });
  }
};

/**
 * Get all clients
 * GET /api/clients
 */
exports.getAllClients = async (req, res) => {
  try {
    const { limit = 100, orderBy = 'createdAt', direction = 'desc' } = req.query;

    // Validate limit
    const parsedLimit = parseInt(limit, 10);
    if (isNaN(parsedLimit) || parsedLimit < 1 || parsedLimit > 1000) {
      return res.status(400).json({
        success: false,
        message: 'Limit must be between 1 and 1000',
      });
    }

    // Validate direction
    if (!['asc', 'desc'].includes(direction)) {
      return res.status(400).json({
        success: false,
        message: 'Direction must be asc or desc',
      });
    }

    const clients = await ClientService.getAllClients({
      limit: parsedLimit,
      orderBy,
      direction,
    });

    return res.status(200).json({
      success: true,
      message: 'Clients retrieved successfully',
      count: clients.length,
      data: clients,
    });
  } catch (error) {
    console.error('Error getting clients:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to get clients',
    });
  }
};

/**
 * Get a single client by ID
 * GET /api/clients/:id
 */
exports.getClientById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Client ID is required',
      });
    }

    const client = await ClientService.getClientById(id);

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Client retrieved successfully',
      data: client,
    });
  } catch (error) {
    console.error('Error getting client:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to get client',
    });
  }
};

/**
 * Update call status (toggle called field)
 * PATCH /api/clients/:id/call-status
 */
exports.updateCallStatus = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Client ID is required',
      });
    }

    const client = await ClientService.updateCallStatus(id);

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Call status updated successfully',
      data: client,
    });
  } catch (error) {
    console.error('Error updating call status:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to update call status',
    });
  }
};

/**
 * Delete a client
 * DELETE /api/clients/:id
 */
exports.deleteClient = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Client ID is required',
      });
    }

    const deleted = await ClientService.deleteClient(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Client not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Client deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting client:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete client',
    });
  }
};

/**
 * Get clients by call status
 * GET /api/clients/filter/by-call-status?called=true
 */
exports.getClientsByCallStatus = async (req, res) => {
  try {
    const { called } = req.query;

    if (called === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Call status filter is required',
      });
    }

    const isCalledBool = called === 'true';
    const clients = await ClientService.getClientsByCallStatus(isCalledBool);

    return res.status(200).json({
      success: true,
      message: 'Clients retrieved successfully',
      count: clients.length,
      data: clients,
    });
  } catch (error) {
    console.error('Error filtering clients:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to filter clients',
    });
  }
};
