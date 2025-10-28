const express = require('express');
const router = express.Router();
const { register, login, getProfile } = require('../controllers/authController');
const { validateUserRegistration } = require('../middleware/validation');
const { auth } = require('../middleware/auth');

router.post('/register', validateUserRegistration, register);
router.post('/login', login);
router.get('/profile', auth, getProfile);

module.exports = router;