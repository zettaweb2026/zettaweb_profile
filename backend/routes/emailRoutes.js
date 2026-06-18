const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { sendEmail } = require('../controllers/emailController');

// Rate limiter for email endpoint (max 5 requests per 15 minutes per IP)
const emailRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: 'Too many email requests from this IP. Please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/', emailRateLimiter, sendEmail);

module.exports = router;
