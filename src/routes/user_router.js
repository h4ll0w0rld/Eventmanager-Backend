const userController = require('../controllers/user_controller');

const express = require('express');
const router = express.Router();


router.get('/id/:id', userController.getUserById);
router.post('/add', userController.addUser);


module.exports = router;
