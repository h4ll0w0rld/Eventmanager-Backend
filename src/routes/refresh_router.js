const express = require('express');
const router = express.Router();

const refreshController = require('../controllers/authentification/refreshToken_controller');

router.get('/', refreshController.handleRefreshToken);

module.exports = router;