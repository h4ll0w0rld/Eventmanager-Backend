const eventController = require('../controllers/event_controller');
const shiftCategoryController = require('../controllers/shiftCategory_controller');

const express = require('express');
const router = express.Router();


router.get('/', eventController.getAllEvents);

router.post('/add', eventController.addEvent);


module.exports = router;