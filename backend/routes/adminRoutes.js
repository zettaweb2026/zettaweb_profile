const express = require('express');
const { authenticateUser, authorizeAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authenticateUser, authorizeAdmin);

router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Admin route access granted',
    user: req.user,
  });
});

router.get('/dashboard', (req, res) => {
  res.json({
    success: true,
    sections: [
      'Manage Projects',
      'Manage Services',
      'Manage Contact Requests',
      'Manage Team Members',
    ],
  });
});

module.exports = router;
