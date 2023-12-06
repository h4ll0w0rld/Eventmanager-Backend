const express = require('express');
const router = express.Router();

const authController = require('../controllers/authentification/auth_controller');

router.post('/', authController.handleLogin);

module.exports = router;