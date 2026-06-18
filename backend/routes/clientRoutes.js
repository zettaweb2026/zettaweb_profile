const express = require('express');
const router = express.Router();
const {
  createClient,
  getAllClients,
  updateClient,
  deleteClient,
} = require('../controllers/clientController');

/**
 * Client Routes
 * Base path: /api/clients
 */

router.post('/', createClient);
router.get('/', getAllClients);
router.put('/:id', updateClient);
router.delete('/:id', deleteClient);

module.exports = router;
