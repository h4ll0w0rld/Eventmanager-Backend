const express = require('express');
const router = express.Router();

const logoutController = require('../controllers/authentification/logout_controller');

router.get('/', logoutController.handleLogout);

module.exports = router;