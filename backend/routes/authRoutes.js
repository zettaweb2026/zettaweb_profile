const express = require('express');
const { getCurrentUser, login, register, getAllUsers, deleteUser, updateUser } = require('../controllers/authController');
const { authenticateUser, authorizeSuperAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', authenticateUser, authorizeSuperAdmin, register);
router.post('/login', login);
router.get('/me', authenticateUser, getCurrentUser);
router.get('/users', authenticateUser, authorizeSuperAdmin, getAllUsers);
router.put('/users/:id', authenticateUser, authorizeSuperAdmin, updateUser);
router.delete('/users/:id', authenticateUser, authorizeSuperAdmin, deleteUser);

module.exports = router;
