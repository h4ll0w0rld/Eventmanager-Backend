const eventController = require('../controllers/event_controller');

const express = require('express');
const router = express.Router();


router.get('/all', eventController.getAllEvents);
router.post('/add', eventController.addEvent);
router.delete('/delete/event_id/:event_id', eventController.deleteEventById);


module.exports = router;


