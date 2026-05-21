const express = require('express');
const { auth, authorize } = require('../middleware/auth');
const { validateUserRegistration } = require('../middleware/validation');

function authRoutes(container) {
    const router = express.Router();
    const authController = container.get('AuthController');

    router.post('/register', validateUserRegistration, (req, res) => authController.register(req, res));
    router.post('/login', (req, res) => authController.login(req, res));
    router.get('/profile', auth, (req, res) => authController.getProfile(req, res));
    router.get('/active-dentists', (req, res) => authController.getActiveDentists(req, res));
    router.get('/users', auth, authorize('admin'), (req, res) => authController.getAllUsers(req, res));
    router.delete('/user/:userId', auth, authorize('admin'), (req, res) => authController.deleteUser(req, res));
    router.patch('/user/:userId/deactivate', auth, authorize('admin'), (req, res) => authController.deactivateUser(req, res));

    return router;
}

module.exports = authRoutes;