const express = require('express');
const router = express.Router();
const {
  getAllContent,
  createContent,
  updateContent,
  deleteContent,
} = require('../controllers/contentController');
const { authenticateUser, authorizeResource } = require('../middleware/authMiddleware');

// Get all items for a resource
router.get('/:resource', getAllContent);

// Manage items for a resource
router.post('/:resource', authenticateUser, authorizeResource('resource'), createContent);
router.put('/:resource/:id', authenticateUser, authorizeResource('resource'), updateContent);
router.delete('/:resource/:id', authenticateUser, authorizeResource('resource'), deleteContent);

module.exports = router;
