const activityController = require('../../controllers/activity_controller');

const express = require('express');
const router = express.Router();

router.post('/add', activityController.addActivity);
router.get('/availableUsers/event_id/:event_id/activity_id/:activity_id', activityController.getAvailableUsers);
router.put('/addUser/activity_id/:activity_id/user_id/:user_id', activityController.addUserToActivity);
router.put('/removeUser/activity_id/:activity_id/', activityController.removeUserFromActivity);
router.get('/all/shift_category_id/:shift_category_id', activityController.getActivitiesByShiftCategory);

module.exports = router;