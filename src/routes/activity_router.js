const activityController = require('../controllers/activity_controller');

const express = require('express');
const router = express.Router();

router.post('/add', activityController.addActivity);
router.get('/getActivitiesByShiftCategory/:shift_category_id', activityController.getActivitiesByShiftCategory);

module.exports = router;