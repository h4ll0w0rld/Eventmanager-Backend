const express = require('express');
const router = express.Router();

const registerController = require('../controllers/authentification/register_controller');

router.post('/registerNewUser', registerController.registerNewUser);

module.exports = router;