const express = require('express');
const { getCurrentUser, login, register, getAllUsers, deleteUser } = require('../controllers/authController');
const { authenticateUser, authorizeAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', authenticateUser, authorizeAdmin, register);
router.post('/login', login);
router.get('/me', authenticateUser, getCurrentUser);
router.get('/users', authenticateUser, authorizeAdmin, getAllUsers);
router.delete('/users/:id', authenticateUser, authorizeAdmin, deleteUser);

module.exports = router;
