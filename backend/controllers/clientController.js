const ClientService = require('../models/Client');

exports.createClient = async (req, res) => {
  try {
    const { companyName, email, phone, status } = req.body;

    if (!companyName || !email || !phone) {
      return res.status(400).json({ success: false, message: 'Company Name, email, and phone are required' });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email format' });
    }

    const client = await ClientService.createClient({ companyName, email, phone, status });
    return res.status(201).json({ success: true, message: 'Client created successfully', data: client });
  } catch (error) {
    console.error('Error creating client:', error.message);
    return res.status(500).json({ success: false, message: error.message || 'Failed to create client' });
  }
};

exports.updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ success: false, message: 'Client ID is required' });

    const { companyName, email, phone, status } = req.body;

    const client = await ClientService.updateClient(id, { companyName, email, phone, status });
    if (!client) return res.status(404).json({ success: false, message: 'Client not found' });

    return res.status(200).json({ success: true, message: 'Client updated successfully', data: client });
  } catch (error) {
    console.error('Error updating client:', error.message);
    return res.status(500).json({ success: false, message: error.message || 'Failed to update client' });
  }
};

exports.getAllClients = async (req, res) => {
  try {
    const { limit, orderBy, direction } = req.query;
    const clients = await ClientService.getAllClients({ limit: limit ? parseInt(limit, 10) : undefined, orderBy, direction });
    return res.status(200).json({ success: true, message: 'Clients retrieved successfully', count: clients.length, data: clients });
  } catch (error) {
    console.error('Error getting clients:', error.message);
    return res.status(500).json({ success: false, message: error.message || 'Failed to get clients' });
  }
};

exports.deleteClient = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ success: false, message: 'Client ID is required' });

    const deleted = await ClientService.deleteClient(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Client not found' });

    return res.status(200).json({ success: true, message: 'Client deleted successfully' });
  } catch (error) {
    console.error('Error deleting client:', error.message);
    return res.status(500).json({ success: false, message: error.message || 'Failed to delete client' });
  }
};
