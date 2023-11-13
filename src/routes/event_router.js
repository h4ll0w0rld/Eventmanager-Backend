const eventController = require('../controllers/event_controller');

const express = require('express');
const router = express.Router();


router.get('/all', eventController.getAllEvents);
router.get('/allUsersByEvent/event_id/:event_id', eventController.getAllUsersByEvent);
router.post('/add', eventController.addEvent);
router.delete('/delete/event_id/:event_id', eventController.deleteEventById);
router.get('/addUserToEvent/event_id/:event_id/user_id/:user_id', eventController.addUserToEvent);
router.get('/removeUserFromEvent/event_id/:event_id/user_id/:user_id', eventController.removeUserFromEvent);


module.exports = router;


