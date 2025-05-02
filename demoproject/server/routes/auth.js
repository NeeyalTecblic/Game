const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Unified registration
router.post('/register', authController.register);

// Email verification
router.post('/verify-email', authController.verifyEmail);

// Resend verification code
router.post('/resend-verification', authController.resendVerificationCode);

// Admin login
router.post('/login/admin', authController.adminLogin);

module.exports = router; 