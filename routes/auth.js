const express = require('express');

const router = express.Router();

const { login, register, verifyEmail } = require('../controllers/userController');

router.post('/login', login);
router.post('/register', register);
router.post('/new-email-verification', verifyEmail);

module.exports = router;

