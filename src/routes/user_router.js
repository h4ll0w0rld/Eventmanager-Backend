const userController = require('../controllers/user_controller');

const express = require('express');
const router = express.Router();


router.get('/id/:id', userController.getUserById);
router.get('/event_id/:event_id', userController.getUserByEvent);
router.post('/add', userController.addUser);


module.exports = router;
