const express = require('express');
const router = express.Router();
const {
  createClient,
  getAllClients,
  getClientById,
  updateCallStatus,
  deleteClient,
  getClientsByCallStatus,
} = require('../controllers/clientController');

/**
 * Client Routes
 * Base path: /api/clients
 */

/**
 * POST /api/clients
 * Create a new client
 * Body: { name, email, phone }
 */
router.post('/', createClient);

/**
 * GET /api/clients
 * Get all clients with optional filtering and sorting
 * Query params: limit, orderBy, direction
 */
router.get('/', getAllClients);

/**
 * GET /api/clients/filter/by-call-status
 * Get clients filtered by call status
 * Query params: called (true/false)
 */
router.get('/filter/by-call-status', getClientsByCallStatus);

/**
 * GET /api/clients/:id
 * Get a single client by ID
 */
router.get('/:id', getClientById);

/**
 * PATCH /api/clients/:id/call-status
 * Toggle the called status of a client
 */
router.patch('/:id/call-status', updateCallStatus);

/**
 * DELETE /api/clients/:id
 * Delete a client
 */
router.delete('/:id', deleteClient);

module.exports = router;
