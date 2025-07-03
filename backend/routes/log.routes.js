const express = require('express');
const { createLog, getLogs } = require('../controllers/log.controller');
const { rateLimit } = require('express-rate-limit');
const { RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX } = require('../config/constants');

const router = express.Router();

// Rate limiting for log creation - 5 requests per minute per IP
const createLogLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // 5 requests per windowMs
  message: { 
    success: false, 
    status: 429,
    message: 'Too many requests, please try again later.' 
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Log creation endpoint with rate limiting
router.post('/', createLogLimiter, createLog);

// Log query endpoint
router.get('/', getLogs);

module.exports = router;
