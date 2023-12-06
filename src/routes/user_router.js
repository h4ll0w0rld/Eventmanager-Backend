const userController = require('../controllers/user_controller');
const registerController = require('../controllers/register_controller');
const authController = require('../controllers/auth_controller');

const express = require('express');
const router = express.Router();


router.get('/id/:id', userController.getUserById);
router.get('/eventsByUser/user_id/:user_id', userController.getEventsByUser);
router.get('/all', userController.getAllUsers);
router.delete('/delete/user_id/:user_id', userController.deleteUserById);
router.post('/add', userController.addUser);
router.post('/registerNewUser', registerController.registerNewUser);
router.post('/registerExistingUser/user_id/:user_id', registerController.registerExistingUser);
router.post('/login', authController.handleLogin);

module.exports = router;
