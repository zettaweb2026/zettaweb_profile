const express = require('express');
const router = express.Router();
const {
  createClient,
  getAllClients,
  updateCallStatus,
  deleteClient,
} = require('../controllers/clientController');

/**
 * Client Routes
 * Base path: /api/clients
 */

router.post('/', createClient);
router.get('/', getAllClients);
router.patch('/:id/call-status', updateCallStatus);
router.delete('/:id', deleteClient);

module.exports = router;
